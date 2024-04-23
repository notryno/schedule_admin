import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Select } from "antd";
import GradeModal from "../components/gradeModal";
import {
  getStudents,
  getStudentGrades,
  getAllClassroomNames,
  getCourses,
} from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import Fab from "@mui/material/Fab";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Stack from "@mui/material/Stack";

const { Option } = Select;

const Grades = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const { getUserToken } = useAuth();
  const [courseFilters, setCourseFilters] = useState([]);
  const [courses, setCourses] = useState([]);

  const [type, setType] = useState("edit");

  const userToken = getUserToken();

  useEffect(() => {
    fetchStudentsData();
    fetchClassrooms();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      const uniqueCourses = [
        ...new Set(grades.map((grade) => grade.course[0].name)),
      ];
      const filters = uniqueCourses.map((course) => ({
        text: course,
        value: course,
      }));
      setCourseFilters(filters);
    }
  }, [grades]);

  const fetchGradesData = async (selectedStudent) => {
    try {
      const data = await getStudentGrades(userToken, selectedStudent);
      console.log(data);
      setGrades(data);
      setSelectedStudent(
        students.find((student) => student.id === selectedStudent)
      );
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const courseNames = await getCourses(userToken);
      setCourses(courseNames);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const data = await getAllClassroomNames(userToken);
      setClassrooms(data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const fetchStudentsData = async () => {
    try {
      const data = await getStudents(userToken);
      console.log(data);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentChange = (value) => {
    setSelectedStudent(students.find((student) => student.id === value));
    console.log(
      "Selected student:",
      students.find((student) => student.id === value)
    );
    fetchGradesData(value);
  };

  const columns = [
    {
      title: "Student Email",
      dataIndex: "student",
      key: "student",
      render: () => {
        const studentNew = students.find(
          (student) => student.id === selectedStudent.id
        );
        return studentNew ? studentNew.email : "";
      },
    },
    {
      title: "Student Name",
      dataIndex: "student",
      key: "student",
      render: () => {
        const studentNew = students.find(
          (student) => student.id === selectedStudent.id
        );
        return studentNew
          ? `${studentNew.first_name} ${studentNew.last_name}`
          : "";
      },
    },
    {
      title: "Class",
      dataIndex: "student",
      key: "student",
      render: (student) => {
        const studentNew = students.find(
          (student) => student.id === selectedStudent.id
        );
        const classroomName = classrooms.find(
          (classroom) => classroom.id === studentNew.classroom
        )?.name;
        return classroomName;
      },
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: courseFilters,
      onFilter: (value, record) => record.course[0].name === value,
      render: (courseId) => {
        const course = courses.find((course) => course.id === courseId[0]);
        return course ? course.name : "";
      },
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => a.grade.charCodeAt(0) - b.grade.charCodeAt(0),
      filters: [
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "C", value: "C" },
        { text: "D", value: "D" },
        { text: "F", value: "F" },
      ],
      onFilter: (value, record) => record.grade === value,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => parseInt(a.score) - parseInt(b.score),
      filters: [
        { text: "70-100", value: "70-100" },
        { text: "60-69", value: "60-69" },
        { text: "50-59", value: "50-59" },
        { text: "40-49", value: "40-49" },
        { text: "0-39", value: "0-39" },
      ],
      onFilter: (value, record) => {
        const [min, max] = value.split("-");
        const score = parseInt(record.score);
        return score >= parseInt(min) && score <= parseInt(max);
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedGrade(record);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete this grade?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          //   await deleteGrade(userToken, id);
          await fetchGradesData();
        } catch (error) {
          console.error("Error deleting grade:", error);
        }
      },
      onCancel: () => {
        console.log("Deletion canceled.");
      },
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
    });
  };

  const breadcrumbs = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Courses</Typography>
      </Breadcrumbs>
    </Stack>
  );

  return (
    <>
      <div style={styles.container}>
        <div style={styles.customHeader}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Grades</h1>
            {breadcrumbs}
          </div>
          <div style={styles.selectContainer}>
            <Select
              placeholder="Select Student"
              style={{ width: 200 }}
              onChange={handleStudentChange}
            >
              {students.map((student) => (
                <Option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <Table dataSource={grades} columns={columns} rowKey="id" />
        {selectedStudent && !modalIsOpen && (
          <Fab
            aria-label="add"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
            onClick={() => {
              setType("add");
              setModalIsOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Fab>
        )}
        <GradeModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          fetchGradesData={fetchGradesData}
          selectedGrade={selectedGrade}
          selectedStudent={selectedStudent}
        />
      </div>
    </>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  customHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #ddd",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  selectContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default Grades;

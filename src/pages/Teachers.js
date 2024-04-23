import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal } from "antd";
import { getTeachers, getAllClassroomNames, getCourses } from "../hooks/api";
import Fab from "@mui/material/Fab";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import TeacherModal from "../components/teacherModal";

const Teachers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [type, setType] = useState("edit");
  const [courses, setCourses] = useState([]);

  const { getUserToken } = useAuth();
  const userToken = getUserToken();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers(userToken);
        console.log("Get teachers", data);
        setTeachers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setLoading(false);
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

    fetchTeachers();
    fetchCourses();
  }, [userToken]);

  const fetchAndSetTeachers = async () => {
    try {
      const data = await getTeachers(userToken);
      console.log("In fetchAndSetTeachers");
      setTeachers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (imageUrl) => <Avatar src={imageUrl} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Course",
      dataIndex: "courses",
      key: "courses",
      render: (courseIds) => {
        const courseNames = courseIds.map((id) => {
          const course = courses.find((item) => item.id === id);
          return course ? course.name : "";
        });
        return courseNames.join(", ");
      },
      filters: courses.map((course) => ({
        text: course.name,
        value: course.id,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        if (!Array.isArray(record.courses)) {
          return false;
        }
        return record.courses.includes(value);
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const breadcrumbs = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Teachers</Typography>
      </Breadcrumbs>
    </Stack>
  );

  const handleEdit = (record) => {
    console.log("Edit teacher:", record);
    setSelectedTeacher(record);
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {};

  return (
    <>
      <div style={styles.container}>
        {!modalIsOpen && (
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
        <TeacherModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          selectedTeacher={selectedTeacher}
          fetchAndSetTeachers={fetchAndSetTeachers}
          type={type}
        />
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Teachers</h1>
          {breadcrumbs}
        </div>
        <Table
          dataSource={teachers}
          columns={columns}
          loading={loading}
          rowKey="email"
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
    padding: "16px",
    borderBottom: "1px solid #ddd",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
};

export default Teachers;

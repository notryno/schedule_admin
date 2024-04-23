import React, { useState, useEffect } from "react";
import { Table, Button, Space } from "antd";
import { getCourses, getAllClassroomNames } from "../hooks/api";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import CourseModal from "../components/courseModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button as MuiButton } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
const Courses = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [type, setType] = useState("edit");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { getUserToken } = useAuth();
  const userToken = getUserToken();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(userToken);
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    const fetchClassrooms = async () => {
      try {
        const classroomNames = await getAllClassroomNames(userToken);
        setClassrooms(classroomNames);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchCourses();
    fetchClassrooms();
  }, [userToken]);

  const fetchAndSetCourses = async () => {
    try {
      const data = await getCourses(userToken);
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Classroom",
      dataIndex: "classrooms",
      key: "classrooms",
      render: (classroomIds) => {
        const classroomNames = classroomIds.map((id) => {
          const classroom = classrooms.find((item) => item.id === id);
          return classroom ? classroom.name : "";
        });
        return classroomNames.join(", ");
      },
      filters: classrooms.map((classroom) => ({
        text: classroom.name,
        value: classroom.id,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        if (!Array.isArray(record.classrooms)) {
          return false;
        }
        return record.classrooms.includes(value);
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
        <Typography color="text.primary">Courses</Typography>
      </Breadcrumbs>
    </Stack>
  );

  const handleEdit = (record) => {
    setSelectedCourse(record);
    setType("edit");
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {
    // Implement delete functionality here
  };

  const handleExportPDF = () => {
    setIsGeneratingPDF(true);

    const input = document.getElementById("schedule-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("courses.pdf");
      setIsGeneratingPDF(false);
    });
  };

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
        <CourseModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          selectedCourse={selectedCourse}
          fetchAndSetCourses={fetchAndSetCourses}
          type={type}
        />
        <div style={styles.customHeader}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1 style={styles.headerTitle}>Courses</h1>
              {breadcrumbs}
            </div>
            <div style={{ marginLeft: "auto" }}>
              <MuiButton onClick={handleExportPDF} variant="outlined">
                <FileDownloadOutlined style={{ marginRight: "5px" }} />
                Download PDF
              </MuiButton>
            </div>
          </div>
        </div>
        <Table
          id="schedule-table"
          dataSource={courses}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            pageSize: pageSize,
          }}
          onChange={onChange}
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

export default Courses;

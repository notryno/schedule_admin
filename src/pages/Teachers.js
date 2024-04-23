import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal } from "antd";
import { getTeachers, getAllClassroomNames, getCourses } from "../hooks/api";
import Fab from "@mui/material/Fab";
import { BASE_URL } from "../hooks/authApi";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import TeacherModal from "../components/teacherModal";
import { UserOutlined } from "@ant-design/icons";
import { CheckCircleTwoTone, WarningTwoTone } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button as MuiButton } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";

const Teachers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [type, setType] = useState("edit");
  const [courses, setCourses] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

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
      title: "Profile Picture",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (imageUrl) => (
        <Avatar src={modifiedURL + imageUrl} icon={<UserOutlined />} />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email, record) => {
        const iconColor = record.email_verified ? "green" : "red";
        const icon = record.email_verified ? (
          <CheckCircleTwoTone twoToneColor="green" />
        ) : (
          <WarningTwoTone twoToneColor="red" />
        );
        return (
          <Tag color={iconColor} style={{ cursor: "default" }}>
            <span style={{ marginLeft: "5px" }}>{email}</span>
            {icon}
          </Tag>
        );
      },
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
    setType("edit");
    setSelectedTeacher(record);
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {};

  const handleExportPDF = () => {
    setIsGeneratingPDF(true);

    const input = document.getElementById("schedule-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("teachers.pdf");
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
        <TeacherModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          selectedTeacher={selectedTeacher}
          fetchAndSetTeachers={fetchAndSetTeachers}
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
              <h1 style={styles.headerTitle}>Teachers</h1>
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
          dataSource={teachers}
          columns={columns}
          loading={loading}
          rowKey="email"
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

export default Teachers;

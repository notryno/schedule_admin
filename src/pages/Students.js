import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal } from "antd";
import { getStudents, getAllClassroomNames } from "../hooks/api";
import { BASE_URL } from "../hooks/authApi";
import { UserOutlined } from "@ant-design/icons";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import StudentModal from "../components/studentModal";
import Fab from "@mui/material/Fab";
import { CheckCircleTwoTone, WarningTwoTone } from "@mui/icons-material";

const Students = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [type, setType] = useState("edit");

  const { getUserToken } = useAuth();
  const userToken = getUserToken();

  const modifiedURL = BASE_URL.replace(/\/api\/$/, "");

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents(userToken);
        console.log(data);
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
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

    fetchStudents();
    fetchClassrooms();
  }, [userToken]);

  const fetchAndSetStudents = async () => {
    try {
      const data = await getStudents(userToken);
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
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
      title: "Class",
      dataIndex: "classroom",
      key: "classroom",
      render: (classroomId) => {
        const classroom = classrooms.find((item) => item.id === classroomId);
        return classroom ? classroom.name : "";
      },
      filters: classrooms.map((classroom) => ({
        text: classroom.name,
        value: classroom.id,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.classroom === value,
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
        <Typography color="text.primary">Students</Typography>
      </Breadcrumbs>
    </Stack>
  );

  const handleEdit = (record) => {
    setSelectedStudent(record);
    setType("edit");
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
        <StudentModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          selectedStudent={selectedStudent}
          fetchAndSetStudents={fetchAndSetStudents}
          type={type}
        />
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Students</h1>
          {breadcrumbs}
        </div>
        <Table
          dataSource={students}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
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

export default Students;

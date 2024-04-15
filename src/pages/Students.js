import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal } from "antd";
import { getStudents, getAllClassroomNames } from "../hooks/api";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import StudentModal from "../components/studentModal";

const Students = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { userToken } = useAuth();

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
      console.log("In fetchAndSetStudents");
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
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
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {};

  return (
    <>
      <div style={styles.container}>
        <StudentModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          selectedStudent={selectedStudent}
          fetchAndSetStudents={fetchAndSetStudents}
        />
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Students</h1>
          {breadcrumbs}
        </div>
        <Table
          dataSource={students}
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

export default Students;

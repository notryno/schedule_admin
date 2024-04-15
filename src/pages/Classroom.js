import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal } from "antd";
import ClassroomModal from "../components/classroomModal";
import { getAllClassroomNames } from "../hooks/api";
import { useAuth } from "../hooks/authContext";

const Classrooms = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const { userToken } = useAuth();

  useEffect(() => {
    fetchClassroomsData();
  }, []);

  const fetchClassroomsData = async () => {
    try {
      const data = await getAllClassroomNames(userToken);
      console.log(data);
      setClassrooms(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
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

  const handleEdit = (record) => {
    setSelectedClassroom(record);
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this schedule?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          // await deleteSchedule(userToken, id);
          await fetchClassroomsData();
        } catch (error) {
          console.error("Error deleting schedule:", error);
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

  return (
    <>
      <div style={styles.container}>
        <ClassroomModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          fetchClassroomsData={fetchClassroomsData}
          selectedClassroom={selectedClassroom}
        />
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Classrooms</h1>
        </div>
        <Table
          dataSource={classrooms}
          columns={columns}
          loading={loading}
          rowKey="id"
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

export default Classrooms;

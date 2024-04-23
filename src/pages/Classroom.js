import React, { useState, useEffect } from "react";
import { Table, Avatar, Tag, Space, Button, Modal, Typography } from "antd";
import ClassroomModal from "../components/classroomModal";
import { getAllClassroomNames } from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Breadcrumbs, Button as MuiButton, Stack, Fab } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Classrooms = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const { getUserToken } = useAuth();
  const [type, setType] = useState("edit");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const userToken = getUserToken();

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

  const breadcrumbs = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Classrooms</Typography>
      </Breadcrumbs>
    </Stack>
  );

  const handleExportPDF = () => {
    setIsGeneratingPDF(true);

    const input = document.getElementById("schedule-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("classrooms.pdf");
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
        <ClassroomModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          fetchClassroomsData={fetchClassroomsData}
          selectedClassroom={selectedClassroom}
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
              <h1 style={styles.headerTitle}>Classroom</h1>
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

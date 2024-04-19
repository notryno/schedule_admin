import React, { useState, useEffect } from "react";
import ScheduleModal from "../components/scheduleModal";
import UpdateScheduleModal from "../components/updateScheduleModal";
import Fab from "@mui/material/Fab";
import { Table, Tag, Space, Button, Modal } from "antd";
import { useAuth } from "../hooks/authContext";
import {
  getSchedules,
  getAllClassroomNames,
  deleteSchedule,
} from "../hooks/api";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Schedule = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserToken } = useAuth();
  const userToken = getUserToken();
  const [classrooms, setClassrooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules(userToken);
        setSchedules(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setLoading(false);
      }
    };

    const fetchClassrooms = async () => {
      try {
        console.log("userToken in fetchClassrooms", userToken);
        const classroomNames = await getAllClassroomNames(userToken);
        setClassrooms(classroomNames);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    fetchSchedules();
    fetchClassrooms();
  }, [userToken]);

  const fetchAndSetSchedules = async () => {
    try {
      const data = await getSchedules(userToken);
      console.log("In fetchAndSetSchedules");
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => a.start_date.localeCompare(b.start_date),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      sorter: (a, b) => a.start_time.localeCompare(b.start_time),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      sorter: (a, b) => a.end_time.localeCompare(b.end_time),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = "geekblue";
        if (type === "Lecture") color = "green";
        else if (type === "Workshop") color = "magenta";
        else if (type === "Tutorial") color = "volcano";
        else if (type === "Lab") color = "gold";
        else if (type === "Assessment") color = "red";
        return <Tag color={color}>{type}</Tag>;
      },
      filters: [
        { text: "Lecture", value: "Lecture" },
        { text: "Workshop", value: "Workshop" },
        { text: "Tutorial", value: "Tutorial" },
        { text: "Lab", value: "Lab" },
        { text: "Assessment", value: "Assessment" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.type.startsWith(value),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filters: [
        { text: "Nepal", value: "Nepal" },
        { text: "London", value: "London" },
        { text: "Alumni", value: "Alumni" },
        { text: "Skill", value: "Skill" },
        { text: "Online", value: "Online" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.location.startsWith(value),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Instances",
      dataIndex: "number_of_instances",
      key: "number_of_instances",
      sorter: (a, b) => a.number_of_instances - b.number_of_instances,
    },
    {
      title: "Frequency",
      dataIndex: "frequency_per_week",
      key: "frequency_per_week",
      sorter: (a, b) => a.frequency_per_week - b.frequency_per_week,
    },
    {
      title: "Day of week",
      dataIndex: "day_of_week",
      key: "day_of_week",
      render: (day) => {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return days[day];
      },
      filters: [
        { text: "Sunday", value: 0 },
        { text: "Monday", value: 1 },
        { text: "Tuesday", value: 2 },
        { text: "Wednesday", value: 3 },
        { text: "Thursday", value: 4 },
        { text: "Friday", value: 5 },
        { text: "Saturday", value: 6 },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.day_of_week === value,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => {
        return (
          <div
            style={{
              backgroundColor: color,
              width: "75px",
              height: "40px",
              borderRadius: "5px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            }}
          ></div>
        );
      },
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

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleEdit = (record) => {
    setSelectedSchedule(record);
    setUpdateModalIsOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this schedule?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await deleteSchedule(userToken, id);
          await fetchAndSetSchedules();
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

  const handleClick = (event) => {
    event.preventDefault();
    console.log("Breadcrumb clicked");
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
        <Typography color="text.primary">Schedules</Typography>
      </Breadcrumbs>
    </Stack>
  );

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {!modalIsOpen && (
          <Fab
            aria-label="add"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
            onClick={() => setModalIsOpen(true)}
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
        <ScheduleModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          fetchAndSetSchedules={fetchAndSetSchedules}
        />
        <UpdateScheduleModal
          isOpen={updateModalIsOpen}
          onRequestClose={() => setUpdateModalIsOpen(false)}
          selectedSchedule={selectedSchedule}
          fetchAndSetSchedules={fetchAndSetSchedules}
        />
      </div>
      <div className="z-40" style={styles.container}>
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Schedules</h1>
          {breadcrumbs}
        </div>
        <Table
          dataSource={schedules}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
          }}
          onChange={onChange}
          className="z-1"
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

export default Schedule;

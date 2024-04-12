import React, { useState, useEffect } from "react";
import ScheduleModal from "../components/scheduleModal";
import Fab from "@mui/material/Fab";
import { Table, Tag, Space } from "antd";
import { useAuth } from "../hooks/authContext";
import { getSchedules } from "../hooks/api";

const Schedule = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();

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

    fetchSchedules();
  }, [userToken]);

  const fetchAndSetSchedules = async () => {
    try {
      const data = await getSchedules(userToken);
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
      render: (text, record, index) => index + 1,
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
              border: ".1em black solid",
            }}
          ></div>
        );
      },
    },
    {
      title: "Classroom",
      dataIndex: "classroom",
      key: "classroom",
    },
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {!modalIsOpen && (
          <Fab
            aria-label="add"
            style={{ position: "fixed", bottom: "20px", right: "20px" }}
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
      </div>
      <div className=" z-50">
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

export default Schedule;

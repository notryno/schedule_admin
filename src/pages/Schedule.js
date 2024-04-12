import React, { useState, useEffect } from "react";
import ScheduleModal from "../components/scheduleModal";
import Fab from "@mui/material/Fab";
import { Table } from "antd";
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    // Add more columns as needed
  ];

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
      />
    </div>
    <div className=" z-50">
      <Table
        dataSource={schedules}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
    </>
  );
};

export default Schedule;

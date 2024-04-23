import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  createClassroom,
  createStudent,
  getAllClassroomNames,
} from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "50",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    padding: "0",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    overflowY: "auto",
    maxHeight: "80vh",
  },
};

const ClassroomModal = ({
  isOpen,
  onRequestClose,
  fetchAndSetClassrooms,
  selectedClassroom,
  type,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const { getUserToken } = useAuth();
  const userToken = getUserToken();

  useEffect(() => {
    if (selectedClassroom) {
      setFormData({
        name: selectedClassroom.name,
        start_date: selectedClassroom.start_date,
        end_date: selectedClassroom.end_date,
      });
    } else {
      resetFormData();
    }
  }, [selectedClassroom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStartDateChange = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({ ...formData, start_date: formattedDate });
  };

  const handleEndDateChange = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({ ...formData, end_date: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "edit") {
        // await updateCourse(selectedCourse.id, userToken, formData);
      } else {
        await createClassroom(userToken, formData);
      }
      console.log("Classroom created or updated successfully!");
      onRequestClose(false);
      fetchAndSetClassrooms();
      resetFormData();
    } catch (error) {
      console.error("Error creating or updating classroom:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
    });
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "50",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      padding: "0",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
      overflowY: "auto",
      maxHeight: "80vh",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Classroom Modal"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="mb-4 flex flex-col items-center py-5 px-8 sticky top-0 bg-white z-20"
          style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          {" "}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                onRequestClose(false);
              }}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              type="submit"
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 w-full">
            <span className="mt-1 block w-full border:none focus:outline-none text-2xl font-semibold">
              Classroom
            </span>
          </div>
        </div>
        <div className="p-8 pt-0">
          <div className="mb-4">
            <TextField
              type="text"
              id="name"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="start_date"
                label="Start Date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={dayjs(formData.start_date)}
                onChange={handleStartDateChange}
              />
            </LocalizationProvider>
          </div>
          <div className="mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="end_date"
                label="End Date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={dayjs(formData.end_date)}
                onChange={handleEndDateChange}
              />
            </LocalizationProvider>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ClassroomModal;

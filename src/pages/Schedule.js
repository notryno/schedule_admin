import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { createSchedule } from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import { getAllClassroomNames } from "../hooks/api";
import TextField from "@mui/material/TextField";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    overflowY: "auto", // Enable vertical scrolling
    maxHeight: "80vh",
  },
};

Modal.setAppElement("#root"); // Set the root element for accessibility

const Schedule = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    start_date: new Date(),
    start_time: "",
    end_time: "",
    type: "",
    location: "",
    description: "",
    number_of_instances: 1,
    frequency_per_week: 1,
    day_of_week: 0,
    color: "#8ee03c",
    classroom: "",
  });
  const { userToken } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [currentPage, setCurrentPage] = useState("Home");
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const classTypes = [
    { label: "Lecture", value: "Lecture" },
    { label: "Tutorial", value: "Tutorial" },
    { label: "Workshop", value: "Workshop" },
    { label: "Lab", value: "Lab" },
  ];
  const colorsData = [
    { group: "Orange", colors: ["#ffb42f", "#ff9900", "#df7e02"] },
    { group: "Yellow", colors: ["#ffe852", "#ffcc33", "#e0b102"] },
    { group: "Green", colors: ["#8ee03c", "#71c418", "#55a800"] },
    { group: "Turquoise", colors: ["#74c7e2", "#58acc6", "#3992ab"] },
    { group: "Blue", colors: ["#638efe", "#4075e1", "#085cc5"] },
    { group: "Purple", colors: ["#c77cff", "#ab62e3", "#8e48c6"] },
    { group: "Pink", colors: ["#f97ec2", "#db63a6", "#be478c"] },
    { group: "Red", colors: ["#eb514a", "#cc3232", "#ac0a1d"] },
    { group: "Black", colors: ["#333333", "#1a1a1a", "#000000"] },
  ];

  const [formErrors, setFormErrors] = useState({
    title: false,
    location: false,
  });

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const classroomNames = await getAllClassroomNames(userToken);
        setClassrooms(classroomNames);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };
    fetchClassrooms();
  }, []);

  const handleTypePage = () => {
    setCurrentPage("TypeItem");
  };

  const handleDayPage = () => {
    setCurrentPage("DayItem");
  };

  const handleClassPage = () => {
    setCurrentPage("ClassItem");
  };

  const handleHomePage = () => {
    setCurrentPage("Home");
  };

  const handleColorPage = () => {
    setCurrentPage("ColorItem");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "number_of_instances" ||
      name === "frequency_per_week" ||
      name === "day_of_week" ||
      name === "classroom"
        ? parseInt(value, 10)
        : value;
    setFormData({ ...formData, [name]: parsedValue });
    setFormErrors({ ...formErrors, [name]: value.trim() === "" });
    console.log(formErrors);
  };

  const handleDateChange = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({ ...formData, start_date: formattedDate });
  };

  const handleTimeChange = (name, time) => {
    const newTime = new Date(time);
    const hours = String(newTime.getHours()).padStart(2, "0");
    const minutes = String(newTime.getMinutes()).padStart(2, "0");
    const seconds = String(newTime.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setFormData({ ...formData, [name]: formattedTime });
  };

  const handleSelectOption = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setCurrentPage("Home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = Object.values(formErrors).every((error) => !error);

    const validateFormFields = () => {
      const errors = {};

      // Validate title
      if (formData.title.trim() === "") {
        errors.title = true;
      }

      // Validate location
      if (formData.location.trim() === "") {
        errors.location = true;
      }

      // Set form errors
      setFormErrors(errors);

      // Check if there are any errors
      return Object.values(errors).every((error) => !error);
    };

    if (formValid && validateFormFields()) {
      try {
        await createSchedule(userToken, formData);
        console.log("Schedule created successfully!");
        setModalIsOpen(false);
        resetFormData();
      } catch (error) {
        console.error("Error creating schedule:", error);
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      start_date: new Date(),
      start_time: "",
      end_time: "",
      type: "",
      location: "",
      description: "",
      number_of_instances: 1,
      frequency_per_week: 1,
      day_of_week: 0,
      color: "#8ee03c",
      classroom: "",
    });
    setFormErrors({
      title: false,
      location: false,
    });
  };

  return (
    <>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Create Schedule Modal"
      >
        {/* <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md"> */}
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="mb-4 flex flex-col items-center py-5 px-8 sticky top-0 bg-white z-20"
            style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex justify-between items-center w-full">
              {currentPage === "Home" ? (
                <button
                  onClick={() => setModalIsOpen(false)}
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
              ) : (
                <button
                  onClick={handleHomePage}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
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
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border:none focus:outline-none text-2xl font-semibold"
              />
            </div>
          </div>
          {currentPage === "Home" && (
            <div className="p-8 pt-0">
              <div className="mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="start_date"
                    label="Start Date"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    selected={formData.start_date}
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      type="time"
                      id="start_time"
                      name="start_time"
                      label="Start Time"
                      selected={formData.start_time}
                      onChange={(time) => handleTimeChange("start_time", time)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </LocalizationProvider>
                </div>
                <div className="w-1/2 pl-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      type="time"
                      id="end_time"
                      name="end_time"
                      label="End Time"
                      selected={formData.end_time}
                      onChange={(time) => handleTimeChange("end_time", time)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="mb-4">
                {/* <Select
                  id="type"
                  name="type"
                  label="Type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 rounded-md shadow-sm sm:text-sm"
                >
                  <MenuItem value="lecture">Lecture</MenuItem>
                  <MenuItem value="tutorial">Tutorial</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="lab">Lab</MenuItem>
                </Select> */}
                <button
                  variant="outlined"
                  onClick={handleTypePage}
                  className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{formData.type || "Select Type"}</span>

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <TextField
                  type="text"
                  id="location"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleChange}
                  error={formErrors.location}
                  helperText={
                    formErrors.location ? "Location cannot be empty" : ""
                  }
                  variant="outlined"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              <div className="mb-4">
                <TextField
                  type="multiline"
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description}
                  multiline
                  rows={4}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <TextField
                  type="number"
                  id="number_of_instances"
                  name="number_of_instances"
                  label="Number of Instances"
                  inputProps={{ min: 1 }}
                  value={formData.number_of_instances}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <TextField
                  type="number"
                  id="frequency_per_week"
                  name="frequency_per_week"
                  label="Frequency Per Week"
                  inputProps={{ min: 1 }}
                  value={formData.frequency_per_week}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                {/* <Select
                  id="day_of_week"
                  name="day_of_week"
                  label="Day of Week"
                  value={parseInt(formData.day_of_week)}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <MenuItem value={0}>Sunday</MenuItem>
                  <MenuItem value={1}>Monday</MenuItem>
                  <MenuItem value={2}>Tuesday</MenuItem>
                  <MenuItem value={3}>Wednesday</MenuItem>
                  <MenuItem value={4}>Thursday</MenuItem>
                  <MenuItem value={5}>Friday</MenuItem>
                  <MenuItem value={6}>Saturday</MenuItem>
                </Select> */}
                <button
                  variant="outlined"
                  onClick={handleDayPage}
                  className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{daysOfWeek[formData.day] || "Select Day"}</span>

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                {/* <Select
                  id="selectedClass"
                  name="classroom"
                  label="Classroom"
                  value={formData.classroom}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {classrooms.map((classroom) => (
                    <MenuItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </MenuItem>
                  ))}
                </Select> */}
                <button
                  variant="outlined"
                  onClick={handleClassPage}
                  className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {classrooms.find(
                      (classroom) => classroom.id === formData.classroom
                    )?.name || "Select Class"}
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <button
                  variant="outlined"
                  onClick={handleColorPage}
                  className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: formData.color,
                  }}
                >
                  <span className="text-white">Color</span>

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {currentPage === "TypeItem" && (
            <div className="p-8 pt-0">
              <label className="block text-lg font-medium text-gray-700 ml-2">
                Select Type
              </label>
              {classTypes.map((type) => (
                <div key={type.value} className="mb-2">
                  <button
                    variant="outlined"
                    onClick={() => handleSelectOption("type", type.value)}
                    className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {type.label}
                  </button>
                </div>
              ))}
            </div>
          )}
          {currentPage === "DayItem" && (
            <div className="p-8 pt-0">
              <label className="block text-lg font-medium text-gray-700 ml-2">
                Select Day
              </label>
              {daysOfWeek.map((day, index) => (
                <div key={index} className="mb-2">
                  <button
                    variant="outlined"
                    onClick={() => handleSelectOption("day", index)}
                    className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {day}
                  </button>
                </div>
              ))}
            </div>
          )}
          {currentPage === "ClassItem" && (
            <div className="p-8 pt-0">
              <label className="block text-lg font-medium text-gray-700 ml-2">
                Select Class
              </label>
              {classrooms.map((classroom) => (
                <div key={classroom.id} className="mb-2">
                  <button
                    variant="outlined"
                    onClick={() =>
                      handleSelectOption("classroom", classroom.id)
                    }
                    className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {classroom.name}
                  </button>
                </div>
              ))}
            </div>
          )}
          {currentPage === "ColorItem" && (
            <div className="p-8 pt-0">
              {colorsData.map((groupItem, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <label className="block text-lg font-medium text-gray-700 ml-2 mb-2">
                    {/* {groupItem.group} */}
                  </label>
                  <div className="grid grid-cols-3">
                    {groupItem.colors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        style={{ backgroundColor: color }}
                        className={`w-full h-16 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:border sm:text-sm hover:border-black hover:border ${
                          colorIndex === 0 ? "rounded-l-md" : ""
                        } ${
                          colorIndex === groupItem.colors.length - 1
                            ? "rounded-r-md"
                            : ""
                        }`}
                        onClick={() => handleSelectOption("color", color)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
        {/* </div> */}
      </Modal>
    </>
  );
};

export default Schedule;

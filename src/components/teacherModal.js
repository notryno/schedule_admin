import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { createTeacher, getCourses, updateTeacher } from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";

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

Modal.setAppElement("#root");

const TeacherModal = ({
  isOpen,
  onRequestClose,
  fetchAndSetTeachers,
  selectedTeacher,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    courses: [],
  });
  const { getUserToken } = useAuth();
  const userToken = getUserToken();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(userToken);
        console.log("Courses", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
    console.log("Courses:", courses);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeacher(selectedTeacher.id, userToken, formData);
      console.log("Teacher updated successfully!");
      console.log(formData);
      onRequestClose(false);
      fetchAndSetTeachers();
      resetFormData();
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  const handleSelectOption = (name, value) => {
    let updatedValue = [];

    if (Array.isArray(value)) {
      updatedValue = value;
    } else if (value) {
      updatedValue = [value];
    }

    console.log("Updated Value:", updatedValue);
    setFormData({ ...formData, [name]: updatedValue });
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        console.log("Selected Teacher:", selectedTeacher);
        setFormData({
          email: selectedTeacher.email,
          username: selectedTeacher.username,
          firstName: selectedTeacher.first_name,
          lastName: selectedTeacher.last_name,
          courses: selectedTeacher.courses
            ? courses
                .filter((course) => selectedTeacher.courses.includes(course.id))
                .map((course) => ({ ...course, id: course.id }))
            : [],
        });
        console.log("Course set:", formData.courses);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      }
    };
    fetchTeacher();
  }, [selectedTeacher]);

  const resetFormData = () => {
    setFormData({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      courses: [],
    });
  };

  console.log(formData);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Update Schedule Modal"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="mb-4 flex flex-col items-center py-5 px-8 sticky top-0 bg-white z-20"
          style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
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
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full border:none focus:outline-none text-2xl font-semibold"
            />
          </div>
        </div>

        <div className="p-8 pt-0">
          <div className="mb-4">
            <TextField
              type="text"
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="mb-4">
            <TextField
              type="text"
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="mb-4">
            <TextField
              type="text"
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="mb-4">
            <Autocomplete
              multiple
              limitTags={2}
              id="tags-outlined"
              options={courses.filter(
                (course) => !formData.courses.some((c) => c.id === course.id)
              )}
              // options={courses}
              getOptionLabel={(option) => option.name}
              value={formData.courses}
              onChange={(event, selectedCourses) =>
                handleSelectOption("courses", selectedCourses)
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Course"
                  placeholder="Course"
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherModal;

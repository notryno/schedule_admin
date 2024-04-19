import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateUser, getAllClassroomNames } from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

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

const StudentModal = ({
  isOpen,
  onRequestClose,
  fetchAndSetStudents,
  selectedStudent,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    classroom: "",
  });
  const { getUserToken } = useAuth();
  const userToken = getUserToken();
  const [classrooms, setClassrooms] = useState([]);
  const [currentPage, setCurrentPage] = useState("Home");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Selected Student:", formData);

      await updateUser(selectedStudent.id, userToken, formData);
      console.log("Student created successfully!");
      onRequestClose(false);
      fetchAndSetStudents();
      resetFormData();
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  const handleHomePage = (e) => {
    e.preventDefault();
    setCurrentPage("Home");
  };

  const handleClassPage = (e) => {
    e.preventDefault();
    setCurrentPage("ClassItem");
  };

  const handleSelectOption = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setCurrentPage("Home");
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setFormData({
          email: selectedStudent.email,
          username: selectedStudent.username,
          firstName: selectedStudent.first_name,
          lastName: selectedStudent.last_name,
          classroom: selectedStudent.classroom,
        });
        console.log(formData);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [selectedStudent]);

  const resetFormData = () => {
    setFormData({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      classroom: "",
    });
  };

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
          {currentPage === "Home" ? (
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
          ) : (
            <div className="flex justify-between items-center w-full">
              <button
                type="button"
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
            </div>
          )}
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

        {currentPage === "Home" && (
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
              <button
                variant="outlined"
                onClick={handleClassPage}
                className={`flex items-center mt-1 w-full px-3 py-4 border border-gray-300 hover:border-black rounded shadow-sm focus:outline-none  text-base text-gray-600`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  lineHeight: "normal",
                  padding: "1.0313rem 0.875rem",
                }}
              >
                <span
                  className={`${
                    formData.classroom ? "text-black" : "text-gray-600"
                  }`}
                >
                  {classrooms.find(
                    (classroom) => classroom.id === formData.classroom
                  )?.name || "Select Class"}
                </span>
                <svg
                  className={`w-5 h-5 }`}
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
                  onClick={() => handleSelectOption("classroom", classroom.id)}
                  className="flex items-center mt-1 w-full px-3 py-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:border-black"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {classroom.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default StudentModal;

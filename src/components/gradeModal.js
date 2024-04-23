import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select } from "@mui/material";
import { getCourses, createGrade } from "../hooks/api";
import MenuItem from "@mui/material/MenuItem";

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

const GradeModal = ({
  isOpen,
  onRequestClose,
  fetchGradesData,
  selectedGrade,
  selectedStudent,
}) => {
  const [formData, setFormData] = useState({
    student: "",
    course: "",
    grade: "",
    score: "",
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value, 10) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.student = selectedStudent;
      formData.course = courses.find((course) => course.id === formData.course);

      if (selectedGrade) {
        // await updateGrade(selectedGrade.id, formData);
      } else {
        await createGrade(userToken, formData);
      }
      console.log("Grade created/updated successfully!");
      onRequestClose();
      fetchGradesData(formData.student.id);
      resetFormData();
    } catch (error) {
      console.error("Error creating/updating grade:", error);
    }
  };

  const handleSelectOption = (name) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (selectedGrade) {
      setFormData(selectedGrade);
    } else {
      resetFormData();
    }
  }, [selectedGrade]);

  const resetFormData = () => {
    setFormData({ student: "", course: "", grade: "", score: "" });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        resetFormData();
      }}
      style={customStyles}
      contentLabel="Grade Modal"
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
                resetFormData();
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
              value={
                selectedStudent
                  ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
                  : null
              }
              onChange={handleChange}
              className="mt-1 block w-full border:none focus:outline-none text-2xl font-semibold"
            />
          </div>
        </div>
        <div className="mb-4 p-8 pt-0">
          <div className="mb-4">
            <FormControl variant="outlined" className="w-full">
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                id="course"
                value={formData.course}
                onChange={handleSelectOption("course")}
                label="Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="mb-4">
            <TextField
              type="text"
              id="score"
              name="score"
              label="Score"
              value={formData.score}
              onChange={handleChange}
              variant="outlined"
              className="w-full"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GradeModal;

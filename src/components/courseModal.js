import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateCourse, getAllClassroomNames } from "../hooks/api";
import { useAuth } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import { Select as MUISelect, MenuItem, Autocomplete } from "@mui/material";

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

const CourseModal = ({
  isOpen,
  onRequestClose,
  fetchAndSetCourses,
  selectedCourse,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    year: "",
    semester: "",
    classroom: "",
  });
  const { getUserToken } = useAuth();
  const userToken = getUserToken();
  const [classrooms, setClassrooms] = useState([]);

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
      console.log("Selected Course:", formData);
      // await updateCourse(selectedCourse.id, userToken, formData);
      onRequestClose(false);
      fetchAndSetCourses();
      resetFormData();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleSelectOption = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setFormData({
          name: selectedCourse.name,
          code: selectedCourse.code,
          year: selectedCourse.year,
          semester: selectedCourse.semester,
          classroom: selectedCourse.classroom,
        });
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [selectedCourse]);

  const resetFormData = () => {
    setFormData({
      name: "",
      code: "",
      year: "",
      semester: "",
      classroom: [],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Update Course Modal"
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
              id="name"
              name="name"
              placeholder="Course Name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border:none focus:outline-none text-2xl font-semibold"
            />
          </div>
        </div>

        <div className="p-8 pt-0">
          <div className="mb-4">
            <TextField
              type="text"
              id="code"
              name="code"
              label="Code"
              value={formData.code}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="mb-4">
            <MUISelect
              id="year"
              name="year"
              label="Year"
              value={formData.year}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              <MenuItem value={1}>I</MenuItem>
              <MenuItem value={2}>II</MenuItem>
              <MenuItem value={3}>III</MenuItem>
              <MenuItem value={4}>IV</MenuItem>
              <MenuItem value={5}>V</MenuItem>
              <MenuItem value={6}>VI</MenuItem>
              <MenuItem value={7}>VII</MenuItem>
              <MenuItem value={8}>VIII</MenuItem>
              <MenuItem value={9}>IX</MenuItem>
              <MenuItem value={10}>X</MenuItem>
              {/* Add more MenuItems for higher Roman numerals if needed */}
            </MUISelect>
          </div>

          <div className="mb-4">
            <MUISelect
              id="semester"
              name="semester"
              label="Semester"
              value={formData.semester}
              onChange={handleChange}
              variant="outlined"
              className={`mt-1 block w-full px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              <MenuItem value={1}>First</MenuItem>
              <MenuItem value={2}>Second</MenuItem>
              <MenuItem value={3}>Third</MenuItem>
              <MenuItem value={4}>Fourth</MenuItem>
              <MenuItem value={5}>Fifth</MenuItem>
              <MenuItem value={6}>Sixth</MenuItem>
              <MenuItem value={7}>Seventh</MenuItem>
              <MenuItem value={8}>Eighth</MenuItem>
              <MenuItem value={9}>Ninth</MenuItem>
              <MenuItem value={10}>Tenth</MenuItem>
              <MenuItem value={11}>Eleventh</MenuItem>
              <MenuItem value={12}>Twelfth</MenuItem>
            </MUISelect>
          </div>
          <div className="mb-4">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={classrooms}
              getOptionLabel={(option) => option.name}
              value={formData.classroom}
              onChange={(event, selectedClassrooms) =>
                handleSelectOption("classroom", selectedClassrooms)
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Classroom"
                  placeholder="Classroom"
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

export default CourseModal;

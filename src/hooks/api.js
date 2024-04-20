import axios from "axios";
import { BASE_URL } from "./authApi";

const api = axios.create({
  baseURL: BASE_URL,
});

export const createSchedule = async (userToken, formData) => {
  try {
    const response = await api.post("/create-schedule/", formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClassroomNames = async (userToken) => {
  try {
    const response = await api.get("/classroom/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchedules = async (userToken) => {
  try {
    const response = await api.get("/schedules/all/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourses = async (userToken) => {
  try {
    const response = await api.get("/courses/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = async (userToken, scheduleId) => {
  try {
    const response = await api.delete(`/schedule/${scheduleId}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editSchedule = async (userToken, scheduleId, formData) => {
  try {
    const response = await api.patch(`/schedule/${scheduleId}/`, formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userToken, newformData, file) => {
  try {
    const formData = new FormData();

    formData.append("first_name", newformData.firstName);
    formData.append("last_name", newformData.lastName);
    formData.append("username", newformData.email);
    formData.append("email", newformData.email);
    formData.append("password", newformData.password);
    if (newformData.profile_picture) {
      formData.append("profile_picture", {
        uri: file,
        type: "image/jpeg",
        name: newformData.profile_picture.name,
      });
    }
    delete formData.firstName;
    delete formData.lastName;
    console.log("formData:", formData);

    // const form = new FormData();
    // Object.keys(formData).forEach((key) => {
    //   form.append(key, formData[key]);
    // });
    // console.log("form:", form);

    const response = await api.post("/register/", formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async (userToken) => {
  try {
    const response = await api.get("/students/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userToken, formData) => {
  try {
    const response = await api.patch(`/user/${userId}/`, formData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (courseId, userToken, formData) => {
  try {
    const classroomIds = formData.classrooms.map((classroom) => classroom.id);
    const updatedFormData = { ...formData, classrooms: classroomIds };

    console.log("Updated formData for PATCH:", updatedFormData);
    const response = await api.patch(`/courses/${courseId}/`, updatedFormData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (userToken, formData) => {
  try {
    const classroomIds = formData.classrooms.map((classroom) => classroom.id);
    const updatedFormData = { ...formData, classrooms: classroomIds };
    const response = await api.post("/course/", updatedFormData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeachers = async (userToken) => {
  try {
    const response = await api.get("/teachers/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

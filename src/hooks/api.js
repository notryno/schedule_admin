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
    console.log("Schedule", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEvents = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}schedules/all/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response data format");
    }

    const events = [];

    response.data.forEach((event) => {
      const startDate = new Date(event.start_date);
      const options = {
        month: "long",
        day: "2-digit",
        year: "numeric",
        weekday: "long",
      };
      const formattedDate = startDate.toLocaleDateString("en-US", options);

      const frequencyPerWeek = event.frequency_per_week || 1;
      const numberOfInstances = event.number_of_instances || 1;
      const dayOfWeek = event.day_of_week; // get the day of the week for the event

      let instanceDate = new Date(startDate);

      // Find the starting day that matches the day of the week
      while (instanceDate.getDay() !== dayOfWeek) {
        instanceDate.setDate(instanceDate.getDate() + 1);
      }

      // Push instances of the event
      for (let i = 0; i < numberOfInstances; i++) {
        const instanceFormattedDate = instanceDate.toLocaleDateString(
          "en-US",
          options
        );

        events.push({
          date: instanceFormattedDate,
          title: event.title,
          time:
            formatTime(event.start_time) + " - " + formatTime(event.end_time),
          type: event.type,
          location: event.location,
          color: event.color,
          description: event.description,
        });

        // Increase the instance date based on frequency per week
        instanceDate.setDate(instanceDate.getDate() + frequencyPerWeek * 7);
      }
    });

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return groupEventsByDate(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const formatTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const hours12 = parseInt(hours) % 12 || 12;
  const amPm = parseInt(hours) < 12 ? "AM" : "PM";
  return `${hours12}:${minutes}${amPm}`;
};

const convertToNewFormat = (mergedEvents) => {
  return mergedEvents.map((event) => ({
    color: event.data[0].color,
    date: event.date,
    location: event.data[0].location,
    time: event.data[0].time,
    title: event.data[0].title,
    type: event.data[0].type,
    description: event.data[0].description,
  }));
};

const groupEventsByDate = (events) => {
  // Group events by date
  const groupedEvents = {};
  events.forEach((event) => {
    if (!groupedEvents[event.date]) {
      groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });

  // Convert groupedEvents object to array and sort by date
  const sortedGroupedEvents = Object.keys(groupedEvents)
    .sort((a, b) => {
      const dateA = new Date(Date.parse(a.replace(/,/g, "")));
      const dateB = new Date(Date.parse(b.replace(/,/g, "")));
      return dateA - dateB;
    })
    .map((date) => ({
      date,
      data: groupedEvents[date].sort((a, b) => {
        // Extract start time from the event objects and convert to a comparable format
        const startTimeA = extractTime(a.time);
        const startTimeB = extractTime(b.time);
        return startTimeA - startTimeB;
      }),
    }));

  return sortedGroupedEvents;
};

const extractTime = (timeString) => {
  // Split the time string to get the start time part
  const [startTime] = timeString.split(" - ");
  // Parse the start time string to get hours and minutes
  const [hours, minutes, period] = startTime.split(/:| /).map(Number);
  // Convert to 24-hour format
  const hours24 = period === 12 ? hours : hours + (period === 1 ? 12 : 0);
  // Return minutes since midnight
  return hours24 * 60 + minutes;
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

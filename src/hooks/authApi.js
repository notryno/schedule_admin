import axios from "axios";

export const BASE_URL = "http://100.64.223.247:8000/api/";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}register/`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw "Error registering user";
  }
};

export const login = async (userData) => {
  try {
    console.log('Inside login')
    const response = await axios.post(`${BASE_URL}login/`, userData);
    console.log(response);
    const csrfToken = extractCSRFTokenFromCookies(response);
    storeCSRFToken(csrfToken);
    console.log(csrfToken);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw "Error logging in";
  }
};

const extractCSRFTokenFromCookies = (response) => {
  console.log(response.headers)
  const cookies = response.headers["set-cookie"];
  console.log('cookies', cookies)
  if (cookies) {
    const csrfCookie = cookies.find((cookie) =>
      cookie.startsWith("csrftoken=")
    );
    if (csrfCookie) {
      return csrfCookie.split(";")[0].split("=")[1];
    }
  }
  return null;
};

const storeCSRFToken = (csrfToken) => {
  sessionStorage.setItem("csrfToken", csrfToken);
};

const getCSRFToken = () => {
  return sessionStorage.getItem("csrfToken");
};

export const getUserData = async (userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}get_user_data/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw "Error fetching user data";
  }
};

export const updateUserData = async (userToken, newData) => {
  try {
    const formData = new FormData();

    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });

    const response = await axios.patch(
      `${BASE_URL}update_user_data/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw "Error updating user data";
  }
};

export const updateProfilePicture = async (userToken, newProfilePicture) => {
  try {
    const formData = new FormData();

    if (newProfilePicture && newProfilePicture.uri) {
      const timestamp = new Date().getTime();
      const fileName = `profile_picture_${timestamp}.jpg`;

      formData.append("profile_picture", {
        uri: newProfilePicture.uri,
        name: fileName,
        type: "image/jpeg",
      });
    }

    const response = await axios.patch(
      `${BASE_URL}update_user_data/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw "Error updating profile picture";
  }
};

export const updatePassword = async (userToken, passwordData) => {
  try {
    const csrfToken = getCSRFToken();

    const response = await axios.patch(
      `${BASE_URL}update_password/`,
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw "Error updating password";
  }
};

import React, { createContext, useContext, useEffect } from "react";
import base64 from "base-64";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const isTokenExpired = () => {
      const storedToken = sessionStorage.getItem("userToken");
      if (!storedToken) return true;
      const tokenExpiration = decodeToken(storedToken).exp;
      console.log("Token expiration:", new Date(tokenExpiration * 1000));
      return Date.now() >= tokenExpiration * 1000;
    };

    if (isTokenExpired()) {
      signOut();
    }
    const tokenExpirationCheckInterval = setInterval(() => {
      if (isTokenExpired()) {
        signOut();
      }
    }, 15 * 60 * 1000); // Check token expiration every 15 minutes

    return () => clearInterval(tokenExpirationCheckInterval);
  }, []);

  const decodeToken = (token) => {
    const payload = token.split(".")[1];
    return JSON.parse(base64.decode(payload));
  };

  const signIn = (token, profile) => {
    sessionStorage.setItem("userToken", token);
    sessionStorage.setItem("userProfile", JSON.stringify(profile));
  };

  const signOut = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userProfile");
  };

  const getUserToken = () => sessionStorage.getItem("userToken");
  const getUserProfile = () =>
    JSON.parse(sessionStorage.getItem("userProfile"));

  return (
    <AuthContext.Provider
      value={{ getUserToken, getUserProfile, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

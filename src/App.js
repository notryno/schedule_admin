import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Classroom from "./pages/Classroom";
import User from "./pages/User";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { useAuth, AuthProvider } from "./hooks/authContext";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { userToken } = useAuth();

  return userToken !== null ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <NavBar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<PrivateRoute element={Home} />} />
          <Route
            path="/schedule"
            element={<PrivateRoute element={Schedule} />}
          />
          <Route path="/user" element={<PrivateRoute element={User} />} />
          <Route
            path="/classroom"
            element={<PrivateRoute element={Classroom} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

// App.js

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
import Students from "./pages/Students";
import Login from "./pages/Login";
import Sidebar from "./components/sidebar";
import { useAuth, AuthProvider } from "./hooks/authContext";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Modify from "./pages/Modify";
import Grades from "./pages/Grades";

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
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <Routes>
            <Route path="/" element={<PrivateRoute element={Home} />} />
            <Route
              path="/schedule"
              element={<PrivateRoute element={Schedule} />}
            />
            <Route
              path="/teachers"
              element={<PrivateRoute element={Teachers} />}
            />
            <Route path="/grades" element={<PrivateRoute element={Grades} />} />
            <Route
              path="/students"
              element={<PrivateRoute element={Students} />}
            />
            <Route
              path="/courses"
              element={<PrivateRoute element={Courses} />}
            />
            <Route
              path="/classroom"
              element={<PrivateRoute element={Classroom} />}
            />
            <Route
              path="/special-schedule"
              element={<PrivateRoute element={Modify} />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;

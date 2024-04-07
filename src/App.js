import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Classroom from './pages/Classroom';
import User from './pages/User';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NavBar from './components/navbar';
import Sidebar from './components/sidebar';
import { AuthProvider } from './hooks/authContext';

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
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/user" element={<User />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

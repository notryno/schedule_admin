import React, { useState } from "react";
import { Button } from "antd";
import {
  HomeOutlined,
  SupervisorAccountOutlined,
  PeopleAltOutlined,
  EventNoteOutlined,
  EditCalendarOutlined,
  ClassOutlined,
  BadgeOutlined,
  LogoutOutlined,
  HistoryEduOutlined,
  CoPresentOutlined,
} from "@mui/icons-material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();

  const { signOut } = useAuth();

  const toggleisOpen = () => {
    toggleSidebar(!isOpen);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  const navItems = [
    { key: "home", icon: <HomeOutlined />, label: "Home", link: "/" },
    {
      key: "teachers",
      icon: <CoPresentOutlined />,
      label: "Teachers",
      link: "/teachers",
    },
    {
      key: "grades",
      icon: <HistoryEduOutlined />,
      label: "Grades",
      link: "/grades",
    },
    {
      key: "students",
      icon: <PeopleAltOutlined />,
      label: "Students",
      link: "/students",
    },
    {
      key: "courses",
      icon: <ClassOutlined />,
      label: "Courses",
      link: "/courses",
    },
    {
      key: "schedule",
      icon: <EventNoteOutlined />,
      label: "Schedule",
      link: "/schedule",
    },
    {
      key: "specialSchedule",
      icon: <EditCalendarOutlined />,
      label: "Modify",
      link: "/special-schedule",
    },
    {
      key: "classroom",
      icon: <BadgeOutlined />,
      label: "Classroom",
      link: "/classroom",
    },
  ];

  const activeStyle = {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
  };

  if (currentPath === "/login") {
    return null;
  }

  return (
    <div
      className="w-20 z-49"
      style={{ height: "100vh", width: isOpen ? "13%" : "8%" }}
    >
      <div
        style={{
          backgroundColor: "burlywood",
          top: "calc(50vh - 40vh)",
          height: "80vh",
          position: "fixed",
          left: 20,
          width: isOpen ? "11%" : "5%",
          transition: "width 0.3s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "5% 0",
          borderRadius: "20px",
        }}
        className="drop-shadow-lg"
      >
        <Button
          onClick={toggleisOpen}
          style={{
            marginBottom: 16,
            borderRadius: "100%",
            padding: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 20,
            left: isOpen ? 135 : 70,
            zIndex: 1000,
          }}
        >
          {!isOpen ? (
            <ArrowForwardIosRoundedIcon style={{ fontSize: 16 }} />
          ) : (
            <ArrowBackIosNewRoundedIcon style={{ fontSize: 16 }} />
          )}
        </Button>
        <div
          style={{ width: "80%", textAlign: "center" }}
          className="h-full flex flex-col justify-between"
        >
          {navItems.map((item) => (
            <Link key={item.key} to={item.link}>
              <div
                className={`items-center flex ${
                  !isOpen ? "justify-center py-4" : "justify-start py-4 px-2"
                } ${currentPath === item.link ? "active" : ""}`}
                style={{
                  ...{ fontSize: 42, cursor: "pointer" },
                  ...(currentPath === item.link ? activeStyle : {}),
                }}
              >
                {item.icon}
                {isOpen && (
                  <span style={{ marginLeft: 10, fontSize: 16 }}>
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div
            onClick={handleSignOut}
            style={{ marginTop: 16, cursor: "pointer" }}
          >
            <LogoutOutlined />
            {isOpen && (
              <span style={{ marginLeft: 10, fontSize: 16 }}>Logout</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

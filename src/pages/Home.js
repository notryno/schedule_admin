import React, { useState, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../hooks/authContext";
import { Badge, Calendar } from "antd";
import { getEvents } from "../hooks/api";

const breadcrumbs = (
  <Stack direction="row" spacing={1} alignItems="center">
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>
      <Typography color="text.primary">Calendar</Typography>
    </Breadcrumbs>
  </Stack>
);

const Home = () => {
  const [events, setEvents] = useState([]);

  const { getUserToken } = useAuth();
  const userToken = getUserToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEvents(userToken);
        // Transform the fetched data into the required format for the Calendar component
        console.log(response);
        setEvents(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getListData = (value) => {
    // Filter events for the specific date
    const filteredEvents = events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      if (
        eventDate.getDate() === value.date() &&
        eventDate.getMonth() === value.month() &&
        eventDate.getFullYear() === value.year()
      ) {
        acc.push({
          color: event.data[0].color,
          content: event.data[0].title,
        });
      }
      return acc;
    }, []);

    return filteredEvents;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge color={item.color} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Home</h1>
          {breadcrumbs}
        </div>
        <Calendar
          events={events}
          style={{ height: 500 }} // Adjust height as needed
          cellRender={cellRender}
        />
      </div>
    </>
  );
};

const styles = {
  container: {
    width: "100%",
    padding: 10,
  },
  customHeader: {
    padding: "16px",
    borderBottom: "1px solid #ddd",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
};

export default Home;

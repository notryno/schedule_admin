import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const breadcrumbs = (
  <Stack direction="row" spacing={1} alignItems="center">
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>
      <Typography color="text.primary">Schedule</Typography>
    </Breadcrumbs>
  </Stack>
);

const Teachers = () => {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.customHeader}>
          <h1 style={styles.headerTitle}>Teachers</h1>
          {breadcrumbs}
        </div>
      </div>
    </>
  );
};
const styles = {
  container: {
    width: "100%",
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

export default Teachers;

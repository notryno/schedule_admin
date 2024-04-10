import React, { useState } from "react";
import ScheduleModal from "../components/scheduleModal";
import Fab from "@mui/material/Fab";

const Schedule = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!modalIsOpen && (
        <Fab
          aria-label="add"
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={() => setModalIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Fab>
      )}
      <ScheduleModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default Schedule;

import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";

const EventContent = ({ eventInfo }) => (
  <Tooltip title={eventInfo.event.title} placement="top">
    <Box
      sx={{
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Slightly darker on hover
        },
      }}
    >
      <Typography
        variant="body2"
        fontStyle="italic"
        component="span"
        display="block"
        sx={{
          cursor: "pointer",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%", // Ensure it won't overflow calendar cells
        }}
      >
        {eventInfo.event.title}
      </Typography>
    </Box>
  </Tooltip>
);

export default EventContent;

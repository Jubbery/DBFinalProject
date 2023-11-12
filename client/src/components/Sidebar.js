import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { formatDate } from "@fullcalendar/core";

const SidebarEvent = ({ event }) => (
  <ListItem
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      padding: "0.5em",
      marginBottom: "0.5em",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: "4px",
    }}
  >
    <ListItemText
      primary={formatDate(event.start, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
      secondary={event.title}
      primaryTypographyProps={{ fontWeight: "bold", marginBottom: "0.3em" }}
      secondaryTypographyProps={{ fontStyle: "italic" }}
    />
  </ListItem>
);

const Sidebar = ({ weekendsVisible, handleWeekendsToggle, currentEvents }) => (
  <Box
    sx={{
      padding: "20px",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(70vh - 100px)", // Adjust the height as needed
      overflow: "auto", // Makes the sidebar scrollable when content overflows
    }}
  >
    <Box sx={{ marginBottom: "20px" }}>
      <Typography variant="h6">Instructions</Typography>
      <List>
        <ListItem>
          Select dates and you will be prompted to create a new event
        </ListItem>
        <ListItem>Drag, drop, and resize events</ListItem>
        <ListItem>Click an event to delete it</ListItem>
      </List>
    </Box>
    <Box sx={{ marginBottom: "20px" }}>
      <FormControlLabel
        control={
          <Checkbox checked={weekendsVisible} onChange={handleWeekendsToggle} />
        }
        label="Toggle weekends"
      />
    </Box>
    <Box
      sx={{
        flex: "1", // Makes this box fill the remaining space
        overflowY: "auto", // Makes the event list scrollable
      }}
    >
      <Typography variant="h6">All Events ({currentEvents.length})</Typography>
      <List>
        {currentEvents.map((event) => (
          <SidebarEvent key={event.id} event={event} />
        ))}
      </List>
    </Box>
  </Box>
);

export default Sidebar;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import DOMPurify from "dompurify";

const StringDisplay = ({ text }) => {
  const formattedText = text
    .replace(/\\n/g, "<br>") // Replace escaped newlines
    .replace(/\\;/g, ";") // Replace escaped semicolons
    .replace(/\\,/g, ","); // Replace escaped commas

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

const EventItem = ({ event }) => {
  const mapEvent = mapEventToObject(event);
  const rawHtmlDescription = mapEvent.xAltDesc;
  const safeHtmlDescription = DOMPurify.sanitize(rawHtmlDescription);
  if (!mapEvent.summary) {
    return <Typography>No Event Summary</Typography>;
  }

  return (
    <Box margin={3} border={1}>
      <Typography variant="h6">{mapEvent.summary}</Typography>
      {mapEvent.description.length !== 0 ? (
        <Typography variant="body2">{mapEvent.description}</Typography>
      ) : (
        <Typography variant="body2">No Description</Typography>
      )}
      {safeHtmlDescription && <StringDisplay text={safeHtmlDescription} />}
    </Box>
  );
};

const EventsList = ({ events }) => {
  return (
    <Box>
      {events.map((event, index) => (
        <EventItem key={index} event={event.event} />
      ))}
    </Box>
  );
};

const mapEventToObject = (eventData) => {
  // Initialize an empty object to hold our mapped data
  const mappedEvent = {
    dtstamp: "",
    uid: "",
    dtstart: "",
    class: "",
    description: "",
    sequence: "",
    summary: "",
    url: "",
    xAltDesc: "",
  };

  // Loop through the 2nd element of the component array, which holds the event details
  eventData.component[1].forEach((detail) => {
    // Use the 1st element as the key and the 4th element as the value
    const key = detail[0];
    const value = detail[3];

    // Map iCalendar keys to obj keys
    switch (key) {
      case "dtstamp":
        mappedEvent.dtstamp = value;
        break;
      case "uid":
        mappedEvent.uid = value;
        break;
      case "dtstart":
        mappedEvent.dtstart = value;
        break;
      case "class":
        mappedEvent.class = value;
        break;
      case "description":
        mappedEvent.description = value;
        break;
      case "sequence":
        mappedEvent.sequence = value;
        break;
      case "summary":
        mappedEvent.summary = value;
        break;
      case "url":
        mappedEvent.url = value;
        break;
      case "x-alt-desc":
        // Note: We can also sanitize the HTML here
        mappedEvent.xAltDesc = value;
        break;
      default:
        break;
    }
  });

  // Return the mapped event obj
  return mappedEvent;
};

// Debug canvas data component
// Left in to demonstrate how canvas calendar data is retrieved
const Debug = () => {
  const [canvasURL, setCanvasURL] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllCanvasEvents = async () => {
    setLoading(true);
    setError(null);

    if (!canvasURL) {
      setError("Please enter a Canvas Calendar URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/events/fetchAllCanvasEvents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ canvasURL }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching all Canvas events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="Canvas Calendar URL"
        value={canvasURL}
        onChange={(e) => setCanvasURL(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        onClick={fetchAllCanvasEvents}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        Fetch Events
      </Button>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <EventsList events={events} />
    </Box>
  );
};

export default Debug;

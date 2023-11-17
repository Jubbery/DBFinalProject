import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/event-utils";
import { Box, Button, TextField, Grid, CircularProgress } from "@mui/material";
import Sidebar from "./Sidebar";
import EventModal from "./EventModal";
import EventDetailsModal from "./EventDetailsModal";
import EventContent from "./EventContent";

const Calendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [canvasURL, setCanvasURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => setModalOpen(true);

  const handleCloseModal = () => setModalOpen(false);

  const handleEventClick = (info) => {
    setEventDetailsOpen(true);
    setSelectedEvent(info.event);
  };

  const handleCloseEventDetailsModal = () => {
    setEventDetailsOpen(false);
    setSelectedEvent(null);
  };

  const handleWeekendsToggle = () => setWeekendsVisible(!weekendsVisible);

  const handleDateSelect = (selectInfo) => {
    // Open modal for new event
    setModalOpen(true);

    // Set initial event data based on selection
    setNewEventTitle("");
    setNewEventDate(selectInfo.startStr); // set start date

    // Optionally, if you want to handle end date
    // setNewEventEndDate(selectInfo.endStr);
  };

  const handleEventAdd = () => {
    if (newEventTitle && newEventDate) {
      const newEventId = createEventId();
      setCurrentEvents((prevEvents) => [
        ...prevEvents,
        {
          id: newEventId,
          description: newEventDescription,
          title: newEventTitle,
          date: newEventDate,
        },
      ]);
      setModalOpen(false);
      setNewEventTitle("");
      setNewEventDate("");
    }
  };

  const handleEventDrop = (dropInfo) => {
    // Update event in the state
    const updatedEvents = currentEvents.map((event) => {
      if (event.id === dropInfo.event.id) {
        return {
          ...event,
          start: dropInfo.event.start,
          end: dropInfo.event.end,
        };
      }
      return event;
    });

    setCurrentEvents(updatedEvents);

    // Optionally, update the event's position in the backend
    // updateEventInBackend(dropInfo.event);
  };

  const handleEventResize = (resizeInfo) => {
    // Update event in the state
    const updatedEvents = currentEvents.map((event) => {
      if (event.id === resizeInfo.event.id) {
        return {
          ...event,
          start: resizeInfo.event.start,
          end: resizeInfo.event.end,
        };
      }
      return event;
    });

    setCurrentEvents(updatedEvents);

    // Optionally, you can also update this in the backend
    // updateEventInBackend(resizeInfo.event);
  };

  const handleFetchCanvasEvents = async () => {
    if (!canvasURL) return;
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/events/fetchCanvasEvents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ canvasURL: canvasURL }),
        }
      );
      const data = await response.json();
      setCurrentEvents((prevEvents) => [...prevEvents, ...data.events]);
      console.log(data.events);
    } catch (error) {
      console.error("Error fetching Canvas events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={9}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today, customButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          customButtons={{
            customButton: {
              text: "Add Event",
              click: () => {
                handleOpenModal();
              },
            },
          }}
          initialView="dayGridMonth"
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents} // Use a function or URL for dynamic event fetching
          eventContent={(eventInfo) => <EventContent eventInfo={eventInfo} />}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
          height={"65vh"}
        />
        <EventModal
          modalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
          newEventTitle={newEventTitle}
          setNewEventTitle={setNewEventTitle}
          newEventDescription={newEventDescription}
          setNewEventDescription={setNewEventDescription}
          newEventDate={newEventDate}
          setNewEventDate={setNewEventDate}
          handleEventAdd={handleEventAdd}
        />
        <EventDetailsModal
          eventDetailsOpen={eventDetailsOpen}
          handleCloseEventDetailsModal={handleCloseEventDetailsModal}
          selectedEvent={selectedEvent}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              value={canvasURL}
              onChange={(e) => setCanvasURL(e.target.value)}
              label="Canvas Calendar URL"
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <Button
              onClick={handleFetchCanvasEvents}
              disabled={loading}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: "10px" }}
            >
              Fetch Canvas Events
            </Button>
          </Box>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ marginY: 2 }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
        </Grid>
        <Sidebar
          weekendsVisible={weekendsVisible}
          handleWeekendsToggle={handleWeekendsToggle}
          currentEvents={currentEvents}
        />
      </Grid>
    </Grid>
  );
};

export default Calendar;

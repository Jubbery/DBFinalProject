import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/event-utils";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
  Grid,
  ListItem,
  List,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default class Calendar extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: INITIAL_EVENTS,
    modalOpen: false,
    eventDetailsOpen: false,
    selectedEvent: null,
    newEventTitle: "",
    newEventDate: "",
    hoverevent: {},
    canvasURL: "",
    loading: false,
  };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {/* Sidebar */}
          {this.renderSidebar()}
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Main content */}
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
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleOpenModal}
              sx={{ marginBottom: "10px" }}
            >
              Add Event
            </Button>

            <TextField
              value={this.state.canvasURL}
              onChange={(e) => this.setState({ canvasURL: e.target.value })}
              label="Canvas Calendar URL"
              fullWidth
              sx={{ marginBottom: "10px" }}
            />

            <Button onClick={this.handleFetchCanvasEvents}>
              Fetch Canvas Events
            </Button>
          </Box>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            events={this.state.currentEvents}
            eventContent={this.renderEventContent}
            eventClick={this.handleEventClick}
            eventMouseEnter={this.handleEventMouseEnter}
            eventMouseLeave={this.handleEventMouseLeave}
          />

          {this.renderEventModal()}
          {this.renderEventDetailsModal()}
        </Grid>
      </Grid>
    );
  }

  renderSidebarEvent(event) {
    return (
      <Box
        key={event.id}
        component="li"
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
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: "0.3em" }}
        >
          {formatDate(event.start, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>

        <Typography variant="body2" fontStyle="italic">
          {event.title}
        </Typography>
      </Box>
    );
  }

  renderSidebar() {
    return (
      <Box
        sx={{
          padding: "20px",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "5px",
        }}
      >
        {/* Instructions Section */}
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

        {/* Toggle Weekends Section */}
        <Box sx={{ marginBottom: "20px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.weekendsVisible}
                onChange={this.handleWeekendsToggle}
              />
            }
            label="Toggle weekends"
          />
        </Box>

        {/* All Events Section */}
        <Box>
          <Typography variant="h6">
            All Events ({this.state.currentEvents.length})
          </Typography>
          <List>{this.state.currentEvents.map(this.renderSidebarEvent)}</List>
        </Box>
      </Box>
    );
  }

  renderEventModal = () => {
    const { modalOpen, newEventTitle, newEventDate } = this.state;
    return (
      <Dialog open={modalOpen} onClose={this.handleCloseModal}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the event details.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEventTitle}
            onChange={(e) => this.setState({ newEventTitle: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Event Date"
            type="date"
            fullWidth
            value={newEventDate}
            onChange={(e) => this.setState({ newEventDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleEventAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderEventDetailsModal = () => {
    const { eventDetailsOpen, selectedEvent } = this.state;
    if (!selectedEvent || !selectedEvent.title) return null;

    return (
      <Dialog
        open={eventDetailsOpen}
        onClose={this.handleCloseEventDetailsModal}
      >
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Title:</strong> {selectedEvent.title}
          </DialogContentText>
          <DialogContentText>
            <strong>Date:</strong> {selectedEvent.start.toLocaleDateString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseEventDetailsModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderEventContent = (eventInfo) => {
    const { hoverevent } = this.state;

    const titleDisplay = (
      <Box
        sx={{
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        overflow="hidden"
      >
        <Typography
          variant="body2"
          fontStyle="italic"
          component="span"
          overflow="hidden"
          display="block"
        >
          {eventInfo.event.title}
        </Typography>
      </Box>
    );

    if (hoverevent && hoverevent.id === eventInfo.event.id) {
      return (
        <Tooltip
          title={`${
            eventInfo.event.title
          } on ${eventInfo.event.start.toLocaleDateString()}`}
          placement="top"
          arrow
        >
          {titleDisplay}
        </Tooltip>
      );
    } else {
      return titleDisplay;
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  handleEventMouseEnter = (info) => {
    this.setState({ hoverevent: info.event });
  };

  handleEventMouseLeave = () => {
    this.setState({ hoverevent: {} }); // Set to an empty object
  };

  handleEventClick = (info) => {
    this.setState({ eventDetailsOpen: true, selectedEvent: info.event });
  };

  handleCloseEventDetailsModal = () => {
    this.setState({ eventDetailsOpen: false, selectedEvent: null });
  };

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleEventAdd = () => {
    const { newEventTitle, newEventDate } = this.state;
    if (newEventTitle && newEventDate) {
      const newEventId = createEventId();
      this.setState((prevState) => ({
        currentEvents: [
          ...prevState.currentEvents,
          { id: newEventId, title: newEventTitle, date: newEventDate },
        ],
        modalOpen: false,
        newEventTitle: "",
        newEventDate: "",
      }));
    }
  };

  handleFetchCanvasEvents = async () => {
    const { canvasURL } = this.state;

    if (!canvasURL) return;
    this.setState({ loading: true });

    fetch("http://localhost:8000/fetchCanvasEvents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ canvasURL: canvasURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          currentEvents: [...prevState.currentEvents, ...data.events],
          loading: false,
        }));
      })
      .catch((error) => {
        console.error("Error fetching Canvas events:", error);
        this.setState({ loading: false });
      });
  };

  truncateTitle(title, maxLength = 15) {
    return title.length > maxLength
      ? title.substr(0, maxLength - 3) + "..."
      : title;
  }
}

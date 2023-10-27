import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ICAL from "ical.js";

export default class Calendar extends React.Component {
  state = {
    events: [
      { title: "CDA Exam 1", date: "2023-10-23" },
      { title: "COP Quiz", date: "2023-10-24" },
    ],
    modalOpen: false,
    eventDetailsOpen: false,
    selectedEvent: null,
    newEventTitle: "",
    newEventDate: "",
    hoverEvent: null,
    canvasURL: "",
    loading: false,
  };

  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleOpenModal}
        >
          Add Event
        </Button>
        <TextField
          value={this.state.canvasURL}
          onChange={(e) => this.setState({ canvasURL: e.target.value })}
          label="Canvas Calendar URL"
          fullWidth
        />
        <Button onClick={this.handleFetchCanvasEvents}>
          Fetch Canvas Events
        </Button>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={this.state.events}
          eventContent={this.renderEventContent}
          eventClick={this.handleEventClick}
          eventMouseEnter={this.handleEventMouseEnter}
          eventMouseLeave={this.handleEventMouseLeave}
          selectAllow="true"
        />
        {this.renderEventModal()}
        {this.renderEventDetailsModal()}
      </div>
    );
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  handleEventMouseEnter = (info) => {
    this.setState({ hoverEvent: info.event });
  };

  handleEventMouseLeave = () => {
    this.setState({ hoverEvent: null });
  };

  handleEventClick = (info) => {
    this.setState({ eventDetailsOpen: true, selectedEvent: info.event });
  };

  handleCloseEventDetailsModal = () => {
    this.setState({ eventDetailsOpen: false, selectedEvent: null });
  };

  handleEventAdd = () => {
    const { newEventTitle, newEventDate } = this.state;
    if (newEventTitle && newEventDate) {
      this.setState((prevState) => ({
        events: [
          ...prevState.events,
          { title: newEventTitle, date: newEventDate },
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

    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    const finalURL = proxyURL + canvasURL;

    this.setState({ loading: true });

    try {
      const response = await fetch(finalURL);
      const data = await response.text();
      const jcalData = ICAL.parse(data);
      const comp = new ICAL.Component(jcalData);
      const events = comp.getAllSubcomponents("vevent").map((vevent) => {
        const event = new ICAL.Event(vevent);
        return {
          title: event.summary,
          date: event.startDate.toJSDate(),
          // extract other properties if needed
        };
      });
      this.setState((prevState) => ({
        events: [...prevState.events, ...events],
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching Canvas events:", error.message);
      console.error(error);
      this.setState({ loading: false });
    }
  };

  truncateTitle(title, maxLength = 15) {
    return title.length > maxLength
      ? title.substr(0, maxLength - 3) + "..."
      : title;
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
    if (!selectedEvent) return null;

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
    const { hoverEvent } = this.state;

    const titleDisplay = (
      <div
        style={{
          padding: "5px",
          borderRadius: "5px",
          background: "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography variant="body2" fontWeight="bold" component="span">
          {eventInfo.timeText}
        </Typography>
        <br />
        <Typography variant="body2" fontStyle="italic" component="span">
          {this.truncateTitle(eventInfo.event.title)}
        </Typography>
      </div>
    );

    if (hoverEvent && hoverEvent.id === eventInfo.event.id) {
      return (
        <Tooltip
          title={`${
            eventInfo.event.title
          } on ${eventInfo.event.start.toLocaleDateString()}`}
          arrow
          placement="top"
        >
          <div>{titleDisplay}</div>
        </Tooltip>
      );
    } else {
      return titleDisplay;
    }
  };
}

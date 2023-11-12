import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const EventDetailsModal = ({
  eventDetailsOpen,
  handleCloseEventDetailsModal,
  selectedEvent,
}) => (
  <Dialog open={eventDetailsOpen} onClose={handleCloseEventDetailsModal}>
    <DialogTitle>Event Details</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <strong>Title:</strong> {selectedEvent?.title}
      </DialogContentText>
      <DialogContentText>
        <strong>Date:</strong> {selectedEvent?.start.toLocaleDateString()}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseEventDetailsModal} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default EventDetailsModal;

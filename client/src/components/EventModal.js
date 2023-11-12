import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const EventModal = ({
  modalOpen,
  handleCloseModal,
  newEventTitle,
  setNewEventTitle,
  newEventDate,
  setNewEventDate,
  handleEventAdd,
}) => (
  <Dialog open={modalOpen} onClose={handleCloseModal}>
    <DialogTitle>Add New Event</DialogTitle>
    <DialogContent>
      <DialogContentText>Please enter the event details.</DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="Event Title"
        fullWidth
        value={newEventTitle}
        onChange={(e) => setNewEventTitle(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Event Date"
        type="date"
        fullWidth
        value={newEventDate}
        onChange={(e) => setNewEventDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal} color="primary">
        Cancel
      </Button>
      <Button onClick={handleEventAdd} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
);

export default EventModal;

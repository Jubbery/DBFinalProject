import React, { Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Markdown from "react-markdown";

const EventDetailsModal = ({
  eventDetailsOpen,
  handleCloseEventDetailsModal,
  selectedEvent,
}) => {
  console.log("selectedEvent", selectedEvent);
  return (
    <Fragment>
      <Dialog open={eventDetailsOpen} onClose={handleCloseEventDetailsModal}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Title:</strong> {selectedEvent?.title}
          </DialogContentText>
          <DialogContentText>
            <strong>Description:</strong>{" "}
            <div>
              <Markdown>{selectedEvent?.extendedProps.description}</Markdown>
            </div>
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
    </Fragment>
  );
};

export default EventDetailsModal;

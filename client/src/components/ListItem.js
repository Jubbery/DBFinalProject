import React, { Fragment, useState } from "react";
import DOMPurify from "dompurify";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextareaAutosize,
  Modal,
  List,
  Divider,
  ListItemText,
  ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AssignmentListItem = ({ myTask, onEdit, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTask, setNewTask] = useState(myTask);

  const handleEdit = () => {
    setModalIsOpen(true);
  };

  const handleDelete = () => {
    onDelete(myTask.task_id);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    await onEdit(myTask.task_id, newTask);
    setModalIsOpen(false);
  };

  const handleChange = (event) => {
    setNewTask({ ...newTask, [event.target.name]: event.target.value });
  };

  let date = new Date(myTask.deadline);

  function replaceTextWithLink(inputString) {
    if (!inputString || inputString.length === 0) return;
    // Eegular expression pattern for markdown links
    const pattern = /\[([^\]]*)\] \(([^)]*)\)/g;

    // Replace all occurrences of the markdown links with a link tag
    const result = inputString.replace(
      pattern,
      '<a href="$2" target="_blank">$1</a>'
    );

    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  }

  return (
    <Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{myTask.task_name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ bgcolor: "background.paper" }}>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="h5"
                      color="text.primary"
                    >
                      Deadline:
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline", marginLeft: "2rem" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {date.toDateString() + " " + date.toLocaleTimeString()}
                    </Typography>
                  </Fragment>
                }
              />
            </ListItem>
            <Divider variant="fullWidth" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="h5"
                    color="text.primary"
                  >
                    Note:
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {replaceTextWithLink(myTask.note)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider variant="fullWidth" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="h5"
                      color="text.primary"
                    >
                      Priority:
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline", marginLeft: "2rem" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {myTask.priority_level}
                    </Typography>
                  </Fragment>
                }
              />
            </ListItem>
            <Divider variant="fullWidth" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="h5"
                      color="text.primary"
                    >
                      Status
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <Fragment>
                    <Typography
                      sx={{ display: "inline", marginLeft: "2rem" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {myTask.task_status}
                    </Typography>
                  </Fragment>
                }
              />
            </ListItem>
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              fullWidth
              onClick={handleEdit}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
            <Button
              fullWidth
              onClick={handleDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        aria-labelledby="edit-task-modal-title"
        aria-describedby="edit-task-modal-description"
      >
        <Box sx={style}>
          <h2>Edit Task</h2>
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Task Name"
              name="task_name"
              value={newTask.task_name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              label="Deadline"
              InputLabelProps={{ shrink: true }}
              name="deadline"
              value={newTask.deadline}
              onChange={handleChange}
              margin="normal"
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Note"
              name="note"
              value={newTask.note}
              onChange={handleChange}
              style={{ width: "100%", marginTop: "8px" }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={newTask.priority}
                label="Priority"
                name="priority"
                onChange={handleChange}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Task Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={newTask.task_status}
                label="Task Status"
                name="task_status"
                onChange={handleChange}
              >
                <MenuItem value="In-Progress">In-Progress</MenuItem>
                <MenuItem value="Not-Started">Not-Started</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ mt: 2, mr: 1 }}>
              Save
            </Button>
            <Button
              onClick={() => setModalIsOpen(false)}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </form>
        </Box>
      </Modal>
    </Fragment>
  );
};

export default AssignmentListItem;

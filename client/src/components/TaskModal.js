import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
  TextareaAutosize,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
// import Modal from 'react-modal';
// import { Button } from "@mui/material";

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

const AddTaskModal = ({ isOpen, onRequestClose }) => {
  // const [user_id] = useState(localStorage.getItem('uid')); // Get user_id from localStorage
  // const [myTasks, setTasks] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("Medium"); // default to Medium
  const [task_type, setTaskType] = useState("Assignment"); // default to Assignment

  const handleChange = (event) => {
    switch (event.target.name) {
      case "taskName":
        setTaskName(event.target.value);
        break;
      case "deadline":
        setDeadline(event.target.value);
        break;
      case "note":
        setNote(event.target.value);
        break;
      case "priority":
        setPriority(event.target.value);
        break;
      case "task_type":
        setTaskType(event.target.value);
        break;
      default:
        break;
    }
  };

  const addTask = async (event) => {
    event.preventDefault();

    const newTask = {
      task_name: taskName,
      deadline: deadline,
      note: note,
      user_id: localStorage.getItem("uid"),
      priority: priority,
      task_type: task_type,
    };

    console.log("current user id:", localStorage.getItem("uid")); // TESTING current user id

    try {
      const response = await fetch("http://localhost:8000/tasks", {
        // Make a POST request to the /tasks endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Response was not ok");
      }

      // const taskData = await response.json();
      // setTasks(prevTasks => [...prevTasks, taskData]);

      onRequestClose();
    } catch (error) {
      console.error("Error during task creation:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="add-task-modal-title"
      aria-describedby="add-task-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={addTask}>
          <TextField
            fullWidth
            label="Task Name"
            name="taskName"
            value={taskName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            label="Deadline"
            InputLabelProps={{ shrink: true }}
            name="deadline"
            value={deadline}
            onChange={handleChange}
            margin="normal"
          />
          <TextareaAutosize
            minRows={3}
            placeholder="Note"
            name="note"
            value={note}
            onChange={handleChange}
            style={{ width: "100%", marginTop: "8px" }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={priority}
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
            <InputLabel id="task-type-select-label">Task Type</InputLabel>
            <Select
              labelId="task-type-select-label"
              id="task-type-select"
              value={task_type}
              label="Task Type"
              name="task_type"
              onChange={handleChange}
            >
              <MenuItem value="Assignment">Assignment</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
              <MenuItem value="Exam">Exam</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddTaskModal;

import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import PlusIcon from "@mui/icons-material/Add";
import FilterSelect from "./FilterSelect";
import AddTaskModal from "./TaskModal";
import AssignmentListItem from "./ListItem";

const Assignments = () => {
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("order/deadline");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onTaskAdded = () => {
    closeModal();
    fetchDataBasedOnFilter(currentFilter);
  };

  const handleFilterChange = (selectedFilter) => {
    setCurrentFilter(selectedFilter);
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      console.log("Fetching tasks..."); // Log before fetching
      const response = await fetch(
        `http://localhost:8000/tasks/order/deadline`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const json = await response.json();
      console.log("Tasks fetched successfully:", json);
      setTasks(json);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDataBasedOnFilter = useCallback(async (filterType) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const url = `http://localhost:8000/tasks/${filterType}`;

    try {
      console.log("Fetching tasks...");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const json = await response.json();
      console.log(`Tasks fetched successfully by ${filterType}`);
      setTasks(json);
    } catch (err) {
      console.error("Error fetching tasks");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error during task update: ${errorData.message}`);
      }

      fetchDataBasedOnFilter(currentFilter);
      console.log("Task edited successfully");

      closeModal();
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error during task deletion: ${errorData.message}`);
      }
      fetchDataBasedOnFilter(currentFilter);
      console.log("TESTING: Task deleted successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchDataBasedOnFilter(currentFilter); // Default filter
  }, [currentFilter]);

  useEffect(() => {
    getData();
  }, [getData]); // Dependency array for useEffect

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Fragment>
      <div className="list-header">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 16px",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            📚 Class Assignments List
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 3, height: "contain" }}>
            <Button
              variant="contained"
              onClick={openModal}
              sx={{ width: "30%", marginRight: "8px" }}
              startIcon={<PlusIcon />}
            >
              Add Task
            </Button>
            <AddTaskModal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              taskAdded={onTaskAdded}
            />
            <FilterSelect
              filterValue={currentFilter}
              onChange={handleFilterChange}
            />
          </Box>
        </Box>
      </div>

      {myTasks &&
        myTasks.map((myTask) => (
          <AssignmentListItem
            key={myTask.task_id}
            myTask={myTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        ))}
    </Fragment>
  );
};

export default Assignments;

import React, { Fragment, useEffect, useState, useCallback } from "react";
// import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
// import { useUser } from "../utils/UserContext";
import { Button } from "@mui/material";
import FilterSelect from "./FilterSelect";
import AddTaskModal from './TaskModal'; // Transfered to 



const Assignments = () => {
  const [user_id] = useState(localStorage.getItem('uid')); // Get user_id from localStorage
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  // const [taskName, setTaskName] = useState('');
  // const [deadline, setDeadline] = useState('');
  // const [note, setNote] = useState('');
  // const [priority, setPriority] = useState('Medium'); // default to Medium
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  if (user_id) {
    // TESTING user logging
    console.log("TESTING: Current User:", user_id, localStorage.getItem('uid'));
  } else {
    console.log("TESTING: No Current User:", user_id);
  }

  const handleFilterChange = (selectedFilter) => {
    fetchDataBasedOnFilter(selectedFilter);
  };

  // NEW CODE using JWT:
  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      console.log("TESTING: Fetching tasks..."); // Log before fetching
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
      console.log("TESTING: Tasks fetched successfully:", json); // Log after successful fetch
      setTasks(json);
    } catch (err) {
      console.error("TESTING: Error fetching tasks:", err); // Log error
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
      console.log("TESTING: Fetching tasks...");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const json = await response.json();
      console.log("TESTING: Tasks fetched successfully:", json);
      setTasks(json);
    } catch (err) {
      console.error("TESTING: Error fetching tasks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error during task update: ${errorData.message}`);
      }
  
      const taskData = await response.json();
      setTasks(prevTasks => prevTasks.map(task => task.task_id === taskId ? taskData : task));
  
      closeModal();
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error during task deletion: ${errorData.message}`);
      }
  
      setTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchDataBasedOnFilter("order/deadline"); // Default filter
  }, [fetchDataBasedOnFilter]);

  useEffect(() => {
    getData();
  }, [getData]); // Dependency array for useEffect


  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Fragment>
      <div className="list-header">
        <h1>📚 Class Assignments List</h1>
        <div className="button-container">
          
          <Button  className="add-task-button" onClick={openModal}>Add Task</Button>
          <AddTaskModal isOpen={modalIsOpen} onRequestClose={closeModal} openModal={openModal} closeModal={closeModal} />

        </div>
        
        <div className="filter-container">
          <FilterSelect onChange={handleFilterChange} />
        </div>
      </div>
      {myTasks &&
        myTasks.map((myTask) => (
          <ListItem key={myTask.task_id} myTask={myTask} onEdit={editTask} onDelete={deleteTask}/>
        ))}
    </Fragment>
  );
};

export default Assignments;

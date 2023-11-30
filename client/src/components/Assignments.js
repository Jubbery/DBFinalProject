import React, { Fragment, useEffect, useState, useCallback } from "react";
// import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
// import { useUser } from "../utils/UserContext";
import { Button } from "@mui/material";

const Assignments = () => {
  const [user_id] = useState(localStorage.getItem('uid')); // Get user_id from localStorage
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');

  if (user_id) {
    // TESTING user logging
    console.log("TESTING: Current User:", user_id, localStorage.getItem('uid'));
  } else {
    console.log("TESTING: No Current User:", user_id);
  }

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

  useEffect(() => {
    getData();
  }, [getData]); // Dependency array for useEffect

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  // MODAL CODE:
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'taskName':
        setTaskName(event.target.value);
        break;
      case 'deadline':
        setDeadline(event.target.value);
        break;
      case 'note':
        setNote(event.target.value);
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
      user_id: localStorage.getItem('uid'),
    };

    console.log("current user id:", localStorage.getItem('uid')); // TESTING current user id
  
    try {
      const response = await fetch('http://localhost:8000/tasks', { // Make a POST request to the /tasks endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error('Response was not ok');
      }
  
      const taskData = await response.json();
      setTasks([...myTasks, taskData]);
  
      closeModal();
    } catch (error) {
      console.error('Error during task creation:', error);
    }
  };

  // END MODAL CODE, check if this even working

  return (
    <Fragment>
      <div className="list-header">
        <h1>📚 Class Assignments List</h1>
        <div className="button-container">

          <Button onClick={openModal}>Add New Task</Button> 

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <form onSubmit={addTask}>
                  <label>
                    Task name:
                    <input type="text" name="taskName" value={taskName} onChange={handleChange} />
                  </label>
                  <label>
                    Deadline:
                    <input type="date" name="deadline" value={deadline} onChange={handleChange} />
                  </label>
                  <label>
                    Note:
                    <textarea name="note" value={note} onChange={handleChange} />
                  </label>
                  <input type="submit" value="Add Task" />
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
      {myTasks &&
        myTasks.map((myTask) => (
          <ListItem key={myTask.task_id} myTask={myTask} />
        ))}
    </Fragment>
  );
};

export default Assignments;

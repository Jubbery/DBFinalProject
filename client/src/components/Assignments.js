import React, { Fragment, useEffect, useState, useCallback } from "react";
// import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
// import { useUser } from "../utils/UserContext";
import { Button } from "@mui/material";
import FilterSelect from "./FilterSelect";

const Assignments = () => {
  const [user_id] = useState(localStorage.getItem('uid')); // Get user_id from localStorage
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('Medium'); // default to Medium


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

  useEffect(() => {
    fetchDataBasedOnFilter("order/deadline"); // Default filter
  }, [fetchDataBasedOnFilter]);

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
      case 'priority':
        setPriority(event.target.value);
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
      priority: priority,
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

          <Button className="add-task-button" onClick={openModal}>Add New Task</Button>
           
          {showModal && (
            <div className="addtask-modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <form onSubmit={addTask}>
                  {/* THE SUBMISSIONS FOR OUR MODAL BELOw */}
                  <label>
                    Task name:
                    <input className="input-field" type="text" name="taskName" value={taskName} onChange={handleChange} />
                  </label>
                  <label>
                    Deadline:
                    <input className="input-field" type="date" name="deadline" value={deadline} onChange={handleChange} />
                  </label>
                  <label>
                    Note:
                    <textarea className="input-field" name="note" value={note} onChange={handleChange} />
                  </label>
                  <label>
                    Priority:
                    <select className="input-field" name="priority" value={priority} onChange={handleChange}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>

                  <input type="submit" value="Add Task" />
                </form>
              </div>
            </div>
          )}

        </div>
        
        <div className="filter-container">
          <FilterSelect onChange={handleFilterChange} />
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

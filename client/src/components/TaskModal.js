import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { Button } from "@mui/material";

const AddTaskModal = ({ isOpen, onRequestClose, openModal, closeModal }) => {
  // const [user_id] = useState(localStorage.getItem('uid')); // Get user_id from localStorage
  // const [myTasks, setTasks] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('Medium'); // default to Medium


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
  
      // const taskData = await response.json();
      // setTasks(prevTasks => [...prevTasks, taskData]);
  
      closeModal();
    } catch (error) {
      console.error('Error during task creation:', error);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      {/* <Button className="add-task-button" onClick={onRequestClose}>Add New Task</Button> */}
      {isOpen && (
        <div className="addtask-modal">
          <div className="modal-content">
            <span className="close-button" onClick={onRequestClose}>&times;</span>
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
  );
};

export default AddTaskModal;
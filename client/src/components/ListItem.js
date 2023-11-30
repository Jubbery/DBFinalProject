import React, { useState } from 'react';
import TickIcon from './TickIcon'

const ListItem = ({myTask, onEdit, onDelete }) => {
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
    setNewTask({...newTask, [event.target.name]: event.target.value});
  };

let date = new Date(myTask.deadline);
let formattedDate = date.toISOString().split('T')[0];
  

return (
  <li className="list-item"> 
    <div className= "info-container">
      <TickIcon/>
      <p className="task-info">{myTask.task_name}</p>
      <p className="task-info">D: {formattedDate}</p>
      <p className="task-info">N: {myTask.note}</p>
    </div>

    <div className= "button-container">
      <button className='edit' onClick={handleEdit}>EDIT</button>
      <button className='delete' onClick={handleDelete}>DELETE</button>
    </div>

    {modalIsOpen && (
  <div className="addtask-modal">
    <h2>Edit Task</h2>
    <form>
      <label>
        Task name:
        <input className="input-field" type="text" name="task_name" value={newTask.task_name} onChange={handleChange} />
      </label>
      <label>
        Deadline:
        <input className="input-field" type="date" name="deadline" value={newTask.deadline} onChange={handleChange} />
      </label>
      <label>
        Note:
        <textarea className="input-field" name="note" value={newTask.note} onChange={handleChange} />
      </label>
      <label>
        Priority:
        <select className="input-field" name="priority" value={newTask.priority} onChange={handleChange}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <label>
        Task Status:
        <select className="input-field" name="task_status" value={newTask.task_status} onChange={handleChange}>
          <option value="In-Progress">In-Progress</option>
          <option value="Not-Started">Not-Started</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
      <button onClick={handleSave}>Save</button>
    </form>
    <button onClick={() => setModalIsOpen(false)}>Close</button>
  </div>
)}
  </li>
);
}  
export default ListItem;
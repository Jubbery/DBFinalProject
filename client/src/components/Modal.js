import React, { useState } from 'react';

const Modal = () => {
  const mode = 'edit';
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your task adding logic here
    console.log('Task:', taskName, 'Deadline:', deadline, 'Note:', note);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task. </h3>
          <button>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input 
            required
            maxLength={250} 
            placeholder="Your task name goes here."
            name="taskName"
            value={taskName}
            onChange={handleChange}
          />
          <br/>
          <input
            required
            type="date"
            name="deadline"
            value={deadline}
            onChange={handleChange}
          />
          <br/>
          <textarea
            placeholder="Your note goes here."
            name="note"
            value={note}
            onChange={handleChange}
          />
          <br/>
          <input type="submit"/>
        </form>

      </div>
    </div>
  );
}

export default Modal;


// const Modal = () => {
//     const mode = 'edit'
    
//     const handleChange = () => {
//         console.log('changing')
//     }

//     return (
//       <div className="overlay">
//         <div className="modal">
//           <div className="form-title-container">
//             <h3>Let's {mode} your task. </h3>
//             <button>X</button>
//           </div>
        
//           <form>
//             <input 
//               required
//               maxLength={250} 
//               placeholder="Your task goes here."
//               name="title"
//               value={""}
//               onChange={handleChange}
//             />
//             <br/>
//             <input
//             />
//             <br/>
//             <input type="submit"/>
//           </form>

//         </div>
//       </div>
//     );
//   }
  
//   export default Modal;
  
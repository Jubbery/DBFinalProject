import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'


const ListItem = ({myTask}) => {
    return (
      // 1:00:15
      <li className="list-item"> 
        <div className= "info-container">
          <TickIcon/>
          <p>{myTask.task_name}</p>
          <ProgressBar/>
        </div>

        <div className= "button-container">
          <button className='edit'>EDIT</button>
          <button className='delete'>DELETE</button>
        
        </div>

      </li>
    );
  }
  
  export default ListItem;
  
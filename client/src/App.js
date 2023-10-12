import ListHeader from "./components/ListHeader";
import ListItem from './components/ListItem'
import { useEffect, useState } from 'react'

const App = () => {
  const user_id = 12345678 // TESTING hardcoded id
  const [ myTasks, setTasks] = useState(null)

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${user_id}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => getData, [])
  
  console.log(myTasks)

  // Sort tasks by date
  const sortedTasks = myTasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">
      <ListHeader listName={'📚 Class Assignments List'}/>
      {sortedTasks?.map((myTask) => <ListItem key={myTask.task_id} myTask={myTask}/>)}
    </div>
  );
}

export default App;

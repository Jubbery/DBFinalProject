import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import React, { Fragment, useEffect, useState } from "react";

const Assignments = () => {
  const user_id = 12345678; // TESTING hardcoded id
  const [myTasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5432/tasks/${user_id}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => getData, []);

  console.log(myTasks);

  // Sort tasks by date
  const sortedTasks = myTasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <Fragment>
      <ListHeader listName={"📚 Class Assignments List"} />
      {sortedTasks?.map((myTask) => (
        <ListItem key={myTask.task_id} myTask={myTask} />
      ))}
    </Fragment>
  );
};

export default Assignments;

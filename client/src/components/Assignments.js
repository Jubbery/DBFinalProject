import React, { Fragment, useEffect, useState, useCallback } from "react";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import { useUser } from "../utils/UserContext";

const Assignments = () => {
  const {user} = useUser();
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/tasks/order/deadline/${user.user_id}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependencies for useCallback

  useEffect(() => {
    getData();
  }, [getData]); // Dependency array for useEffect

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Fragment>
      <ListHeader listName={"📚 Class Assignments List"} />
      {myTasks &&
        myTasks.map((myTask) => (
          <ListItem key={myTask.task_id} myTask={myTask} />
        ))}
    </Fragment>
  );
};

export default Assignments;

import React, { Fragment, useEffect, useState, useCallback } from "react";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import { useUser } from "../utils/UserContext";
import { Button } from "@mui/material";

const Assignments = () => {
  const { user } = useUser();
  const [myTasks, setTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (user) {
    // TESTING user logging
    console.log("TESTING: Current User:", user.user_id);
  } else {
    console.log("TESTING: No Current User:", user);
  }

  // // OLD CODE:
  // const getData = useCallback(async () => {
  //   if (!user) return;

  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/tasks/order/deadline/${user.user_id}`
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Error fetching tasks: ${response.statusText}`);
  //     }
  //     const json = await response.json();
  //     setTasks(json);
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [user]); // Dependencies for useCallback

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

  return (
    <Fragment>
      <div className="list-header">
        <h1>📚 Class Assignments List</h1>
        <div className="button-container">
          <Button variant="contained" className="create">
            ADD NEW
          </Button>
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

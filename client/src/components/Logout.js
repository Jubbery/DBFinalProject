import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    navigate("/login");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <Button onClick={() => setShowConfirmation(true)}>Logout</Button>
      {showConfirmation && (
        <div>
          <p>Are you sure you want to log out?</p>
          <Button onClick={handleLogout}>Yes</Button>
          <Button onClick={handleCancel}>No</Button>
        </div>
      )}
    </div>
  );
}

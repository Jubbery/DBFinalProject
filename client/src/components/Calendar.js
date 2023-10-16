import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

const CLIENT_ID =
  "405252700885-lf8bd7hfov161j82ut4r0iqaauosopb7.apps.googleusercontent.com";

export default function Calendar() {
  const [canvasURL, setCanvasURL] = useState("");

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Successfully logged in!", credentialResponse);
    // Handle any further operations after successful login.
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  const handleLogout = () => {
    googleLogout();
    // Handle any other operations needed on logout.
  };

  const handleURLChange = (e) => {
    setCanvasURL(e.target.value);
    // Handle fetching from Canvas URL and integrate it with Google Calendar if required.
  };

  return (
    <div>
      <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      <button onClick={handleLogout}>Logout</button>
      <input
        type="text"
        placeholder="Paste Canvas URL"
        value={canvasURL}
        onChange={handleURLChange}
      />
      {/* Display fetched Canvas tasks or events */}
    </div>
  );
}

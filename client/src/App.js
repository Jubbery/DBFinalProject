import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Assignments from "./components/Assignments";
import Calendar from "./components/Calendar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="<PUT_CLIENT_ID_HERE_FROM_SERVER>">
      <Router>
        <div className="navbar">
          <NavBar />
        </div>
        <div className="app">
          <div className="body">
            <Routes>
              {/* Example route, modify as needed */}
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/calendar" element={<Calendar />} />
              {/* Add other routes here */}
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

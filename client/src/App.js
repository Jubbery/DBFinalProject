import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Assignments from "./components/Assignments";
import Calendar from "./components/Calendar";
import FAQ from "./components/FAQ";
import Signup from "./components/Signup";

const App = () => {
  // Hard coded for now
  let signedIn = true;

  return (
    <Router>
      <div className="navbar">
        <NavBar />
      </div>
      <div className="app">
        <div className="body">
          <Routes>
            {/* Example route, modify as needed */}
            <Route
              path="/welcome"
              element={signedIn ? <Signup /> : <Assignments />}
            />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/faq" element={<FAQ />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

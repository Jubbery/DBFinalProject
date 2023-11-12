import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Assignments from "./components/Assignments";
import Calendar from "./components/Calendar";
import FAQ from "./components/FAQ";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Debug from "./components/debug";
import { UserProvider } from "./utils/UserContext";

const App = () => {
  // Hard coded for now
  let signedIn = true;

  return (
    <UserProvider>
      <Router>
        <div className="navbar">
          <NavBar />
        </div>
        <div className="app">
          <div className="body">
            <Routes>
              <Route
                path="/welcome"
                element={signedIn ? <Signup /> : <Assignments />}
              />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/debug" element={<Debug />} />
              {/* <Route path="/" element={< />} /> */}
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;

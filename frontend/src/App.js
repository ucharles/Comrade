import "./App.css";
import React from "react";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import AddEvent from "./AddEvent";
import Calendar from "./Calendar";
import ViewDayEvent from "./ViewDayEvent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/new" element={<AddEvent />} />
        <Route path="/:date" element={<ViewDayEvent />} />
      </Routes>
    </Router>
  );
};

export default App;

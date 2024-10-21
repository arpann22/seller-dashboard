// src/components/App.js
import React from "react";
import Tabs from "./components/Tabs/Tabs";
import { useState } from "react";

function App() {
  const [userData, setUserData] = useState({});
  return (
    <div className="App">
      <Tabs userData={userData} setUserData={setUserData} />{" "}
      {/* Render Tabs directly */}
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import "./weather.jsx";
import Weather from "./weather.jsx";
function App() {
  return (
    <>
      <div className="App">
        <Weather />
      </div>
    </>
  );
}

export default App;

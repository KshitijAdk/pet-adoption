import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PetsPage from "./components/PetsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pets" element={<PetsPage />} />
    </Routes>
  );
}

export default App;

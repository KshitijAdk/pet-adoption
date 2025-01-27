import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PetsPage from "./components/PetsPage";
import FAQPage from "./components/FAQPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pets" element={<PetsPage />} />
      <Route path="/faq" element={<FAQPage />} />

    </Routes>
  );
}

export default App;

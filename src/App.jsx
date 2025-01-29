import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PetsPage from "./components/PetsPage";
import FAQPage from "./components/FAQPage";
import EmailVerification from "./components/EmailVerification";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />

      </Routes>
    </>
  );
}

export default App;

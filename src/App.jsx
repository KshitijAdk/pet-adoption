import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


import Home from "./components/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PetsPage from "./components/PetsPage";
import FAQPage from "./components/FAQPage";
import EmailVerification from "./components/EmailVerification";
import ResetPassword from "./components/ResetPassword";
import BlogPage from "./components/BlogsPage";
import Navbar from "./components/Navbar";
import VendorRegistration from "./components/VendorRegistration";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {/* <Navbar/> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/fullblogs" element={<BlogPage />} />
        <Route path="/vendor-registration" element={<VendorRegistration/>} />

      </Routes>
    </>
  );
}

export default App;

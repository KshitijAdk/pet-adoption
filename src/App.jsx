import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import Home from "./components/Landing/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FAQPage from "./components/FAQPage";
import EmailVerification from "./components/EmailVerification";
import ResetPassword from "./components/ResetPassword";
import BlogPage from "./components/BlogsPage";
import Navbar from "./components/Navbar";
import VendorRegistration from "./components/VendorRegistration";
import Footer from "./components/Footer";
import ManageVendors from "./Admin/ManageVendors";
import ManageUsers from "./Admin/ManageUsers";
import PendingApplications from "./Admin/PendingApplications";
import AdminDashboard from "./Admin/AdminDashboard";
import PetListing from "./components/PetListing";
import Profile from "./components/profile/Profile";
import VendorDashboard from "./Vendor/VendorDashboard";
import PetManagement from "./Vendor/PetManagement";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pets" element={<PetListing />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/fullblogs" element={<BlogPage />} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />


        <Route path="/admin/manage-vendors" element={<ManageVendors />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/pending-vendors" element={<PendingApplications />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />


        <Route path="/profile" element={<Profile />} />


        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/pets-listing" element={<PetManagement />} />



      </Routes>
      <Footer />
    </>
  );
}

export default App;

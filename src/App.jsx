import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./components/Landing/home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FAQPage from "./components/FAQPage";
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
import PetDetails from "./components/PetDetails";
import AdoptionStatus from "./components/AdoptionStatus";
import AdoptionRequests from "./Vendor/AdoptionRequests";
import AboutUs from "./components/AboutUs";
import VendorsList from "./components/VendorsList";
import VendorDetails from "./components/VendorDetails";

// Import route protectors
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import VendorRoute from "./routes/VendorRoute";
import NotFoundPage from "./routes/NotFoundPage";
import AllPetsAdmin from "./Admin/AllPetsAdmin";
import AllAdmins from "./Admin/AllAdmins";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pets" element={<PetListing />} />
        <Route path="/pets/:petId" element={<PetDetails />} />
        <Route path="/our-partner-organizations" element={<VendorsList />} />
        <Route path="/vendor/:vendorId" element={<VendorDetails />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/fullblogs" element={<BlogPage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/adoption-status/:adoptionId" element={<AdoptionStatus />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/manage-vendors" element={<ManageVendors />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/pending-vendors" element={<PendingApplications />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/all-pets" element={<AllPetsAdmin />} />
          <Route path="/admin/all-admins" element={<AllAdmins />} />
        </Route>

        {/* Vendor Routes */}
        <Route element={<VendorRoute />}>
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/pets-listing" element={<PetManagement />} />
          <Route path="/vendor/adoption-requests" element={<AdoptionRequests />} />
        </Route>

        {/* 404 Catch-all Route - Should be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
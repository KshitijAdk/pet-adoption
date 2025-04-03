import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { PawPrint, Menu, X, User, LogOut, Settings } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ToastComponent from "./ui/ToastComponent";
import axios from "axios";

const Navbar = () => {
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/logout`, 
        {}, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/");
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/pets", label: "Pets" },
    { path: "/aboutUs", label: "About Us" },
    { path: "/fullblogs", label: "Blogs" },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
                PawsAndHearts
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Menu / Login Button */}
            <div className="flex items-center space-x-4">
              {isLoggedin ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-colors">
                      {userData?.image ? (
                        <img
                          src={userData.image}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-600" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <ToastComponent />
    </>
  );
};

export default Navbar;
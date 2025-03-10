import { useContext, useState } from "react";
import logo from "../assests/image.png";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ToastComponent from "./ui/ToastComponent";
import axios from "axios";

const Navbar = () => {
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout", {}, { withCredentials: true });
      console.log(response.data);

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


  return (
    <>
      <div className="font-medium text-black bg-amber-100 flex flex-wrap justify-evenly items-center p-2 backdrop-blur-lg sticky top-0 left-0 w-full z-50">
        {/* Logo */}
        <div className="rounded-full">
          <Link to={"/"}>
            <img
              src={logo}
              className="rounded-full"
              height="60px"
              width="60px"
              alt="sano sansar logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="text-black text-xs md:text-sm flex rounded-full px-5 py-3">
          <ul className="flex justify-center gap-10 font-bold">
            <li>
              <Link to="/" className="transform transition duration-500 hover:underline underline-offset-4">
                Home
              </Link>
            </li>
            <li>
              <Link to="/pets" className="transform transition duration-500 hover:underline underline-offset-4">
                Pets
              </Link>
            </li>
            <li>
              <Link to="/aboutUs" className="transform transition duration-500 hover:underline underline-offset-4">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/fullblogs" className="transform transition duration-500 hover:underline underline-offset-4">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transform transition duration-500 hover:underline underline-offset-4">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* User Profile / Login */}
        <div className="flex items-center relative">
          {isLoggedin ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 text-lg font-semibold"
              >
                <img
                  src={userData?.image}
                  alt={userData?.name}
                  className="rounded-full w-full h-full object-cover border-2 border-amber-400"
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
      <ToastComponent />
    </>
  );
};

export default Navbar;

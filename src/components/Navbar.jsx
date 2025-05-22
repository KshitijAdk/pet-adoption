import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { PawPrint, Menu, X, User, LogOut, Settings, LayoutDashboard, Store, UserPlus } from "lucide-react";
import Cookies from "js-cookie";
import { message } from "antd"

const Navbar = () => {
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem("user");
        Cookies.remove("token");
        setIsLoggedin(false);
        setUserData(null);
        message.success("Successfully logged out!");
        navigate("/");
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      message.error("An error occurred during logout. Please try again.");
    }
  };

  console.log(userData);



  const getDashboardLink = () => {
    if (!userData?.role) return null;

    switch (userData.role) {
      case 'admin':
        return {
          path: "/admin/dashboard",
          label: "Admin Dashboard",
          icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
        };
      case 'vendor':
        return {
          path: "/vendor-dashboard",
          label: "Vendor Dashboard",
          icon: <Store className="w-4 h-4 mr-2" />,
        };
      case 'user':
        return {
          path: "/vendor-registration",
          label: "Apply for Vendor",
          icon: <UserPlus className="w-4 h-4 mr-2" />,
        };
      default:
        return null;
    }
  };


  const dashboardLink = getDashboardLink();

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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <PawPrint className="w-7 h-7 text-amber-600" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-800">
                NayaSathi
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
            <div className="flex items-center">
              {isLoggedin ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-300"
                    aria-expanded={isProfileMenuOpen}
                    aria-label="Open user menu"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center ring-2 ring-amber-200 transition-all duration-200">
                      {userData?.image ? (
                        <img
                          src={userData?.image}
                          alt={userData?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <Menu
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ease-in-out ${isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {/* </div> */}

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all duration-200">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{userData?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>

                      {dashboardLink && (
                        <Link
                          to={dashboardLink.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <span className="mr-2">{dashboardLink.icon}</span>
                          {dashboardLink.label}
                        </Link>
                      )}


                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                        onClick={() => setIsProfileMenuOpen(false)}
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
        </div >

        {/* Mobile Navigation */}
        {
          isMobileMenuOpen && (
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
                {isLoggedin && (
                  <>
                    {dashboardLink && (
                      <Link
                        to={dashboardLink.path}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dashboardLink.label}
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }
      </nav >
    </>
  );
};

export default Navbar;
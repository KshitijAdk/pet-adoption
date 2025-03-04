import React, { useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import { User, PawPrint, Heart, Calendar, Settings, LogOut, Edit, ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
    const { userData, setUserData, setIsLoggedin, backendUrl } = useContext(AppContent);

    // Handle Logout
    const handleLogout = async () => {
        try {
            const response = await axios.post(backendUrl + "/api/auth/logout");
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
            toast.error("An error occurred during logout. Please try again.");
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
            {/* Profile Section */}
            <div className="p-6 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                    <img
                        src={userData?.image}
                        alt={userData?.name}
                        className="rounded-full w-full h-full object-cover border-4 border-amber-100"
                    />
                    <button className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700">
                        <Edit className="h-4 w-4" />
                    </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData?.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Member since {user.joinDate}</p>
            </div>

            {/* Navigation Menu */}
            <div className="border-t border-gray-200 mt-4">
                <nav className="flex flex-col">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <User className="mr-3 h-5 w-5" />
                        Profile Information
                    </button>

                    <button
                        onClick={() => setActiveTab('adopted')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'adopted'
                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <PawPrint className="mr-3 h-5 w-5" />
                        My Adopted Pets
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {user.adoptedPets.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'favorites'
                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Heart className="mr-3 h-5 w-5" />
                        Favorite Pets
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {user.favoritePets.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'applications'
                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Calendar className="mr-3 h-5 w-5" />
                        My Applications
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {user.applications.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'settings'
                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Settings className="mr-3 h-5 w-5" />
                        Account Settings
                    </button>

                    {/* Admin Dashboard Link */}
                    {userData?.role === "admin" && (
                        <Link to="/admin/dashboard">
                            <button
                                className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'admin-dashboard'
                                    ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <ArrowRightCircle className="mr-3 h-5 w-5" />
                                Go to Admin Dashboard
                            </button>
                        </Link>
                    )}
                    {userData?.role === "vendor" && (
                        <Link to="/vendor-dashboard">
                            <button
                                className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'vendor-dashboard'
                                    ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <ArrowRightCircle className="mr-3 h-5 w-5" />
                                Go to Vendor Dashboard
                            </button>
                        </Link>
                    )}
                    {userData?.role === "user" && (
                        <Link to="/vendor-registration">
                            <button
                                className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'vendor-dashboard'
                                    ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <ArrowRightCircle className="mr-3 h-5 w-5" />
                                Apply for Vendor
                            </button>
                        </Link>
                    )}
                </nav>
            </div>

            {/* Sign Out Button */}
            <div className="p-6 border-t border-gray-200">
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

// Sidebar.js
import React from 'react';
import { User, PawPrint, Heart, Calendar, Settings, LogOut, Edit } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, userData }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
            <div className="p-6 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                    <img
                        src={userData.profileImage}
                        alt={userData.name}
                        className="rounded-full w-full h-full object-cover border-4 border-teal-100"
                    />
                    <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700">
                        <Edit className="h-4 w-4" />
                    </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Member since {userData.joinDate}</p>
            </div>

            <div className="border-t border-gray-200">
                <nav className="flex flex-col">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                            ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <User className="mr-3 h-5 w-5" />
                        Profile Information
                    </button>

                    <button
                        onClick={() => setActiveTab('adopted')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'adopted'
                            ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <PawPrint className="mr-3 h-5 w-5" />
                        My Adopted Pets
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {userData.adoptedPets.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'favorites'
                            ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Heart className="mr-3 h-5 w-5" />
                        Favorite Pets
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {userData.favoritePets.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'applications'
                            ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Calendar className="mr-3 h-5 w-5" />
                        My Applications
                        <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {userData.applications.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'settings'
                            ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Settings className="mr-3 h-5 w-5" />
                        Account Settings
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
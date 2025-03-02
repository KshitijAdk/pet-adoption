import { Edit, User, PawPrint, Heart, Calendar, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ userData, activeTab, setActiveTab }) => {
    return (
        <div className="lg:col-span-3">
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
                        <SidebarButton
                            icon={<User className="mr-3 h-5 w-5" />}
                            label="Profile Information"
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />

                        <SidebarButton
                            icon={<PawPrint className="mr-3 h-5 w-5" />}
                            label="My Adopted Pets"
                            count={userData.adoptedPets.length}
                            isActive={activeTab === 'adopted'}
                            onClick={() => setActiveTab('adopted')}
                        />

                        <SidebarButton
                            icon={<Heart className="mr-3 h-5 w-5" />}
                            label="Favorite Pets"
                            count={userData.favoritePets.length}
                            isActive={activeTab === 'favorites'}
                            onClick={() => setActiveTab('favorites')}
                        />

                        <SidebarButton
                            icon={<Calendar className="mr-3 h-5 w-5" />}
                            label="My Applications"
                            count={userData.applications.length}
                            isActive={activeTab === 'applications'}
                            onClick={() => setActiveTab('applications')}
                        />

                        <SidebarButton
                            icon={<Settings className="mr-3 h-5 w-5" />}
                            label="Account Settings"
                            isActive={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

const SidebarButton = ({ icon, label, count, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
                isActive
                    ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {icon}
            {label}
            {count !== undefined && (
                <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {count}
                </span>
            )}
        </button>
    );
};

export default Sidebar;

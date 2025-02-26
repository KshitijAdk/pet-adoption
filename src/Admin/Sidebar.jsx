import { Home, Users, Store, FileText, LogOut, TrendingUp, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assests/image.png';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="h-screen w-64 bg-purple-100 shadow-lg p-4">
            <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="Logo" className="h-12 w-12" />
                <h1 className="text-xl font-bold text-black ml-2">NayaSathi</h1>
            </div>
            <nav className="space-y-5">
                <h2 className="text-gray-600 font-semibold">MENU</h2>
                <Link to="/" aria-label="Dashboard Home">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/" ? "bg-purple-300" : ""
                        }`}>
                        <Home className="text-black" />
                        <span className="text-black">Dashboard Home</span>
                    </div>
                </Link>
                <Link to="/admin/manage-users" aria-label="Manage Users">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/admin/manage-users" ? "bg-purple-300" : ""
                        }`}>
                        <Users className="text-black" />
                        <span className="text-black">Manage Users</span>
                    </div>
                </Link>
                <Link to="/admin/manage-vendors" aria-label="Manage Vendors">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/admin/manage-vendors" ? "bg-purple-300" : ""
                        }`}>
                        <Store className="text-black" />
                        <span className="text-black">Manage Vendors</span>
                    </div>
                </Link>
                <Link to="/applications" aria-label="Applications">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/applications" ? "bg-purple-300" : ""
                        }`}>
                        <FileText className="text-black" />
                        <span className="text-black">Applications</span>
                    </div>
                </Link>

                <h2 className="text-gray-600 font-semibold mt-4">USEFUL LINKS</h2>
                <Link to="/" aria-label="Main Home">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/" ? "bg-purple-300" : ""
                        }`}>
                        <Home className="text-black" />
                        <span className="text-black">Main Home</span>
                    </div>
                </Link>
                <Link to="/trending" aria-label="Trending">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/trending" ? "bg-purple-300" : ""
                        }`}>
                        <TrendingUp className="text-black" />
                        <span className="text-black">Trending</span>
                    </div>
                </Link>
                <Link to="/following" aria-label="Following">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${location.pathname === "/following" ? "bg-purple-300" : ""
                        }`}>
                        <Star className="text-black" />
                        <span className="text-black">Following</span>
                    </div>
                </Link>
                <Link to="/logout" aria-label="Logout">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-200 cursor-pointer">
                        <LogOut className="text-black" />
                        <span className="text-black">Logout</span>
                    </div>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;

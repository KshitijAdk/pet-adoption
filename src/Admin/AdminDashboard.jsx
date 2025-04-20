import { useState, useEffect } from "react";
import { Home, Users, Clock, ListChecks, PawPrint, BarChart2, Calendar, Dog, Cat } from "lucide-react";
import Sidebar from "../components/ui/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/adminCard'
import { BarChart, PieChart, LineChart } from '../components/ui/charts'
import { Skeleton } from '../components/ui/skeleton'

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // 'day', 'week', 'month', 'year'

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [dashboardRes, statsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/admin/dashboard'),
                    fetch(`http://localhost:3000/api/admin/stats?period=${timeRange}`)
                ]);

                const dashboardData = await dashboardRes.json();
                const statsData = await statsRes.json();

                setStats({
                    ...dashboardData,
                    detailedStats: statsData.stats
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    menuItems={adminMenuItems}
                    title="Admin Panel"
                />
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-lg" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-80 rounded-lg" />
                        <Skeleton className="h-80 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />

            <div className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="bg-white shadow-md mb-6 p-4 rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your pet adoption platform</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex justify-end mb-6">
                    <div className="inline-flex rounded-md shadow-sm">
                        {['day', 'week', 'month', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 text-sm font-medium ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${range === 'day' ? 'rounded-l-lg' : ''} ${range === 'year' ? 'rounded-r-lg' : ''}`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
                            <PawPrint className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totals.pets}</div>
                            <p className="text-xs text-gray-500">
                                {stats.detailedStats.petsAdded} added this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totals.users}</div>
                            <p className="text-xs text-gray-500">
                                {stats.detailedStats.newUsers} new this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totals.vendors}</div>
                            <p className="text-xs text-gray-500">
                                {stats.detailedStats.newVendors} new this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Adoptions</CardTitle>
                            <ListChecks className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totals.adoptions}</div>
                            <p className="text-xs text-gray-500">
                                {stats.detailedStats.adoptions} this {timeRange}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Pet Status Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pet Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <PieChart
                                data={stats.petStats.statusDistribution.map(item => ({
                                    name: item._id,
                                    value: item.count
                                }))}
                            />
                        </CardContent>
                    </Card>

                    {/* Adoption Status Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Adoption Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <PieChart
                                data={stats.adoptionStats.statusDistribution.map(item => ({
                                    name: item._id,
                                    value: item.count
                                }))}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Species Distribution */}
                <div className="grid grid-cols-1 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pets by Species</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <BarChart
                                data={[
                                    { name: 'Dogs', value: stats.petStats.dogs },
                                    { name: 'Cats', value: stats.petStats.cats }
                                ]}
                                colors={['#3b82f6', '#10b981']}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Trends Over Time */}
                <div className="grid grid-cols-1 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trends Over Last 6 Months</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <LineChart
                                data={[
                                    {
                                        name: 'Pets Added',
                                        data: stats.trends.pets.map(item => ({
                                            x: `${new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' })} ${item._id.year}`,
                                            y: item.count
                                        }))
                                    },
                                    {
                                        name: 'Adoptions',
                                        data: stats.trends.adoptions.map(item => ({
                                            x: `${new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' })} ${item._id.year}`,
                                            y: item.count
                                        }))
                                    }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Pets */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recently Added Pets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.recentActivity.pets.slice(0, 5).map(pet => (
                                    <div key={pet._id} className="flex items-center gap-4">
                                        <img
                                            src={pet.imageUrl}
                                            alt={pet.name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium">{pet.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {pet.species} • {pet.breed}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(pet.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Adoptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Adoption Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.recentActivity.adoptions.slice(0, 5).map(adoption => (
                                    <div key={adoption._id} className="flex items-start gap-4">
                                        <img
                                            src={adoption.applicantImage}
                                            alt={adoption.applicantName}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium">{adoption.applicantName}</h3>
                                            <p className="text-sm text-gray-500">
                                                {adoption.petName} • {adoption.status}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(adoption.createdAt)} at {formatTime(adoption.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Vendor Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Vendor Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.recentActivity.vendorApplications.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentActivity.vendorApplications.slice(0, 5).map(app => (
                                        <div key={app._id} className="flex items-start gap-4">
                                            <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{app.organization}</h3>
                                                <p className="text-sm text-gray-500">{app.fullName}</p>
                                                <p className="text-xs text-gray-400">
                                                    {formatDate(app.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No pending applications</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
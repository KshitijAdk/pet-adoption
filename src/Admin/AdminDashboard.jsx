import { useState, useEffect } from "react";
import { Home, Users, Clock, ListChecks, PawPrint, ChevronDown, BarChart2, PieChart as PieChartIcon, Shield } from "lucide-react";
import Sidebar from "./Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/adminCard'
import { BarChart, PieChart } from '../components/ui/charts'
import { Skeleton } from '../components/ui/skeleton'

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // 'day', 'week', 'month', 'year'
    const [chartType, setChartType] = useState('pet-status'); // 'pet-status', 'adoption-status', 'species'
    const [chartDisplay, setChartDisplay] = useState('pie'); // 'pie' or 'bar'


    const chartOptions = [
        { id: 'pet-status', label: 'Pet Status' },
        { id: 'adoption-status', label: 'Adoption Status' },
        { id: 'species', label: 'Species Distribution' }
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

    const renderChartContent = () => {
        const commonData = {
            'pet-status': stats.petStats.statusDistribution.map(item => ({
                name: item._id,
                value: item.count
            })),
            'adoption-status': stats.adoptionStats.statusDistribution.map(item => ({
                name: item._id,
                value: item.count
            })),
            'species': [
                { name: 'Dogs', value: stats.petStats.dogs },
                { name: 'Cats', value: stats.petStats.cats }
            ]
        };

        const chartData = commonData[chartType];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        if (chartDisplay === 'pie') {
            return (
                <PieChart
                    data={chartData}
                    colors={colors}
                />
            );
        } else {
            return (
                <BarChart
                    data={chartData}
                    colors={colors}
                />
            );
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    title="Admin Panel"
                />
                <div className="flex-1 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <Skeleton className="h-64 rounded-lg" />
                        <Skeleton className="h-64 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                title="Admin Panel"
            />

            <div className="flex-1 p-6">
                {/* Header */}
                <div className="bg-white shadow-sm mb-4 p-3 rounded-lg">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600">Overview of your pet adoption platform</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex justify-end mb-4">
                    <div className="inline-flex rounded-md shadow-sm text-xs">
                        {['day', 'week', 'month', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-xs font-medium ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } ${range === 'day' ? 'rounded-l-md' : ''} ${range === 'year' ? 'rounded-r-md' : ''}`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-2">
                            <CardTitle className="text-xs font-medium">Total Pets</CardTitle>
                            <PawPrint className="h-3 w-3 text-gray-500" />
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="text-xl font-bold">{stats.totals.pets}</div>
                            <p className="text-xs text-gray-500">
                                +{stats.detailedStats.petsAdded} this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-2">
                            <CardTitle className="text-xs font-medium">Total Users</CardTitle>
                            <Users className="h-3 w-3 text-gray-500" />
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="text-xl font-bold">{stats.totals.users}</div>
                            <p className="text-xs text-gray-500">
                                +{stats.detailedStats.newUsers} this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-2">
                            <CardTitle className="text-xs font-medium">Total Vendors</CardTitle>
                            <Users className="h-3 w-3 text-gray-500" />
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="text-xl font-bold">{stats.totals.vendors}</div>
                            <p className="text-xs text-gray-500">
                                +{stats.detailedStats.newVendors} this {timeRange}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-2">
                            <CardTitle className="text-xs font-medium">Adoptions</CardTitle>
                            <ListChecks className="h-3 w-3 text-gray-500" />
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="text-xl font-bold">{stats.totals.adoptions}</div>
                            <p className="text-xs text-gray-500">
                                +{stats.detailedStats.adoptions} this {timeRange}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Distribution Chart */}
                    <Card className="md:col-span-1">
                        <CardHeader className="pb-0">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm">Distribution</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <select
                                            value={chartType}
                                            onChange={(e) => setChartType(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 rounded-md py-1 px-3 pr-8 text-xs"
                                        >
                                            {chartOptions.map(option => (
                                                <option key={option.id} value={option.id}>{option.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                    </div>
                                    <div className="flex border border-gray-200 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => setChartDisplay('pie')}
                                            className={`p-1 ${chartDisplay === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'}`}
                                        >
                                            <PieChartIcon className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => setChartDisplay('bar')}
                                            className={`p-1 ${chartDisplay === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'}`}
                                        >
                                            <BarChart2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-60">
                            {renderChartContent()}
                        </CardContent>
                    </Card>

                    {/* Activity Feed */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recent Pets */}
                        <Card>
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm">Recently Added Pets</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="space-y-3">
                                    {stats.recentActivity.pets.slice(0, 4).map(pet => (
                                        <div key={pet._id} className="flex items-center gap-3">
                                            <img
                                                src={pet.imageUrl}
                                                alt={pet.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-sm font-medium">{pet.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {pet.species} • {formatDate(pet.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Adoptions */}
                        <Card>
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm">Recent Adoption Requests</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                <div className="space-y-3">
                                    {stats.recentActivity.adoptions.slice(0, 4).map(adoption => (
                                        <div key={adoption._id} className="flex items-center gap-3">
                                            <img
                                                src={adoption.applicantImage}
                                                alt={adoption.applicantName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-sm font-medium">{adoption.applicantName}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {adoption.petName} • {adoption.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Vendor Applications */}
                        <Card className="md:col-span-2">
                            <CardHeader className="py-2">
                                <CardTitle className="text-sm">Pending Vendor Applications</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                {stats.recentActivity.vendorApplications.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {stats.recentActivity.vendorApplications.slice(0, 4).map(app => (
                                            <div key={app._id} className="flex items-center gap-3">
                                                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium">{app.organization}</h3>
                                                    <p className="text-xs text-gray-500">{formatDate(app.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-xs text-gray-500">No pending applications</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
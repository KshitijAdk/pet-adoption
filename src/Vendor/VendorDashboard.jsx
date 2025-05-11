import React, { useContext, useState, useEffect } from 'react';
import {
  PawPrint, Users, Clock, CheckCircle, Home, ListChecks,
  AlertCircle, Loader2, Smile,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import { AppContent } from '../context/AppContext';
import { PieChart, BarChart } from '../components/ui/charts';
import axios from 'axios';

const VendorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContent);
  const [dashboardData, setDashboardData] = useState({
    vendorDetails: {},
    pets: [],
    adoptionRequests: [],
    counts: {
      pets: { total: 0, available: 0, adopted: 0, pending: 0 },
      adoptionRequests: { total: 0, pending: 0, approved: 0, rejected: 0 }
    }
  });

  const vendorId = userData?.vendorDetails?.vendorId;
  // Fetch vendor data
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const vendorId = userData?.vendorDetails?.vendorId;

        const response = await axios.get(`http://localhost:3000/api/admin/${vendorId}`);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to load dashboard data");
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const vendorMenuItems = [
    { path: "/vendor-dashboard", label: "Dashboard", icon: Home },
    { path: "/pets-listing", label: "Manage Pets", icon: PawPrint },
    { path: "/vendor/adoption-requests", label: "Adoption Requests", icon: ListChecks }
  ];

  // Prepare data for charts
  const petStatusData = [
    { name: 'Available', value: dashboardData.counts.pets.available, icon: <Smile className="w-4 h-4" /> },
    { name: 'Adopted', value: dashboardData.counts.pets.adopted, icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const requestStatusData = [
    { name: 'Pending', value: dashboardData.counts.adoptionRequests.pending },
    { name: 'Approved', value: dashboardData.counts.adoptionRequests.approved },
    { name: 'Rejected', value: dashboardData.counts.adoptionRequests.rejected }
  ];

  // Recent requests sorted by date
  const recentRequests = [...dashboardData.adoptionRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={vendorMenuItems}
        title="Vendor Panel"
      />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-18' : 'ml-18'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, <span className="font-semibold text-indigo-600">{dashboardData.vendorDetails.fullName}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              title: 'Total Pets',
              count: dashboardData.counts.pets.total,
              icon: <PawPrint className="w-6 h-6" />,
              color: 'bg-indigo-100 text-indigo-600',
              link: '/pets-listing'
            }, {
              title: 'Available Pets',
              count: dashboardData.counts.pets.available,
              icon: <CheckCircle className="w-6 h-6" />,
              color: 'bg-green-100 text-green-600',
              link: '/pets-listing?status=Available'
            }, {
              title: 'Pending Requests',
              count: dashboardData.counts.adoptionRequests.pending,
              icon: <Clock className="w-6 h-6" />,
              color: 'bg-yellow-100 text-yellow-600',
              link: '/vendor/adoption-requests?status=Pending'
            }, {
              title: 'Approved Adoptions',
              count: dashboardData.counts.adoptionRequests.approved,
              icon: <Users className="w-6 h-6" />,
              color: 'bg-blue-100 text-blue-600',
              link: '/vendor/adoption-requests?status=Approved'
            }].map((stat, idx) => (
              <Link
                to={stat.link}
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className={`rounded-lg p-3 inline-flex ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Pet Status</h3>
                <Link
                  to="/pets-listing"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View All
                </Link>
              </div>
              <div className="h-64">
                <PieChart data={petStatusData} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {petStatusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-[#0088FE]' :
                      index === 1 ? 'bg-[#00C49F]' : 'bg-[#FFBB28]'
                      }`}></span>
                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Adoption Requests</h3>
                <Link
                  to="/vendor/adoption-requests"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View All
                </Link>
              </div>
              <div className="h-64">
                <BarChart
                  data={requestStatusData.map(item => ({
                    name: item.name,
                    value: item.value
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Adoption Requests</h3>
              <Link
                to="/vendor/adoption-requests"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View All Requests
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={request.applicantImage || '/default-user.png'}
                                alt={request.applicantName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default-user.png';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{request.applicantName}</div>
                              <div className="text-sm text-gray-500">{request.applicantEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.petName}</div>
                          <div className="text-sm text-gray-500">{request.petId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent adoption requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
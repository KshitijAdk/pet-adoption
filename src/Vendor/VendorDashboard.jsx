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
  const { userData, backendUrl } = useContext(AppContent);
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

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const vendorId = userData?.vendorDetails?.vendorId;

        const response = await axios.get(`${backendUrl}/api/admin/${vendorId}`);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to load dashboard data");
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

  const petStatusData = [
    { name: 'Available', value: dashboardData.counts.pets.available, icon: <Smile className="w-4 h-4" /> },
    { name: 'Adopted', value: dashboardData.counts.pets.adopted, icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const requestStatusData = [
    { name: 'Pending', value: dashboardData.counts.adoptionRequests.pending },
    { name: 'Approved', value: dashboardData.counts.adoptionRequests.approved },
    { name: 'Rejected', value: dashboardData.counts.adoptionRequests.rejected }
  ];

  const recentRequests = [...dashboardData.adoptionRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4 max-w-md">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h3 className="mt-2 text-md font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={vendorMenuItems}
        title="Vendor Panel"
      />

      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-18' : 'ml-18'}`}>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, <span className="font-medium text-indigo-600">{dashboardData.vendorDetails.fullName}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[{
              title: 'Total Pets',
              count: dashboardData.counts.pets.total,
              icon: <PawPrint className="w-5 h-5" />,
              color: 'bg-indigo-100 text-indigo-600',
              link: '/pets-listing'
            }, {
              title: 'Available',
              count: dashboardData.counts.pets.available,
              icon: <CheckCircle className="w-5 h-5" />,
              color: 'bg-green-100 text-green-600',
              link: '/pets-listing?status=Available'
            }, {
              title: 'Pending',
              count: dashboardData.counts.adoptionRequests.pending,
              icon: <Clock className="w-5 h-5" />,
              color: 'bg-yellow-100 text-yellow-600',
              link: '/vendor/adoption-requests?status=Pending'
            }, {
              title: 'Approved',
              count: dashboardData.counts.adoptionRequests.approved,
              icon: <Users className="w-5 h-5" />,
              color: 'bg-blue-100 text-blue-600',
              link: '/vendor/adoption-requests?status=Approved'
            }].map((stat, idx) => (
              <Link
                to={stat.link}
                key={idx}
                className="bg-white rounded-lg shadow-xs border border-gray-200 hover:shadow-sm transition-shadow p-3"
              >
                <div className={`rounded-md p-2 inline-flex ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {stat.count}
                </p>
              </Link>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-800">Pet Status</h3>
                <Link
                  to="/pets-listing"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View All
                </Link>
              </div>
              <div className="h-48">
                <PieChart data={petStatusData} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {petStatusData.map((item, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${index === 0 ? 'bg-[#0088FE]' :
                      index === 1 ? 'bg-[#00C49F]' : 'bg-[#FFBB28]'
                      }`}></span>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-800">Adoption Requests</h3>
                <Link
                  to="/vendor/adoption-requests"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View All
                </Link>
              </div>
              <div className="h-48">
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
          <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-md font-semibold text-gray-800">Recent Requests</h3>
              <Link
                to="/vendor/adoption-requests"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={request.applicantImage || '/default-user.png'}
                                alt={request.applicantName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default-user.png';
                                }}
                              />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{request.applicantName}</div>
                              <div className="text-xs text-gray-500">{request.applicantEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {request.petName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full 
                            ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-sm text-gray-500">
                        No recent requests
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
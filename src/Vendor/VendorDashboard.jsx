import React, { useState } from 'react';
import { PawPrint, Users, Clock, CheckCircle, XCircle, Home, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';

const VendorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const vendorMenuItems = [
    { path: "/vendor-dashboard", label: "Dashboard", icon: Home },
    { path: "/pets-listing", label: "Manage Pets", icon: PawPrint },
    { path: "/vendor/adoption-requests", label: "Adoption Requests", icon: ListChecks }
  ];

  const pets = [
    { id: 1, name: 'Buddy', status: 'Available' },
    { id: 2, name: 'Max', status: 'Adopted' },
    { id: 3, name: 'Charlie', status: 'Available' },
    { id: 4, name: 'Lucy', status: 'Pending' },
  ];

  const adoptionRequests = [
    { id: 1, applicantName: 'John Doe', petName: 'Buddy', status: 'Pending', createdAt: new Date('2023-10-01') },
    { id: 2, applicantName: 'Jane Smith', petName: 'Max', status: 'Approved', createdAt: new Date('2023-10-05') },
    { id: 3, applicantName: 'Alice Johnson', petName: 'Charlie', status: 'Pending', createdAt: new Date('2023-10-10') },
    { id: 4, applicantName: 'Bob Brown', petName: 'Lucy', status: 'Rejected', createdAt: new Date('2023-10-15') },
  ];

  const totalPets = pets.length;
  const availablePets = pets.filter(pet => pet.status === 'Available').length;
  const pendingRequests = adoptionRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = adoptionRequests.filter(req => req.status === 'Approved').length;

  const recentRequests = [...adoptionRequests]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={vendorMenuItems}
        title="Vendor Panel"
      />
      
      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-8' : 'ml-8'}`}>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {[{
            title: 'Total Pets', count: totalPets, icon: PawPrint, color: 'indigo', link: '/vendor/manage-pets'
          }, {
            title: 'Available Pets', count: availablePets, icon: CheckCircle, color: 'green', link: '/vendor/manage-pets'
          }, {
            title: 'Pending Requests', count: pendingRequests, icon: Clock, color: 'yellow', link: '/vendor/adoption-requests'
          }, {
            title: 'Approved Adoptions', count: approvedRequests, icon: Users, color: 'blue', link: '/vendor/adoption-requests'
          }].map((stat, idx) => (
            <div key={idx} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 flex items-center">
                <div className={`flex-shrink-0 bg-${stat.color}-100 rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.count}</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-sm">
                <Link to={stat.link} className="font-medium text-indigo-600 hover:text-indigo-500">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

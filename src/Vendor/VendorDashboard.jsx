import React from 'react';
import { PawPrint, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  // Static data for pets
  const pets = [
    { id: 1, name: 'Buddy', status: 'Available' },
    { id: 2, name: 'Max', status: 'Adopted' },
    { id: 3, name: 'Charlie', status: 'Available' },
    { id: 4, name: 'Lucy', status: 'Pending' },
  ];

  // Static data for adoption requests
  const adoptionRequests = [
    { id: 1, applicantName: 'John Doe', petName: 'Buddy', status: 'Pending', createdAt: new Date('2023-10-01') },
    { id: 2, applicantName: 'Jane Smith', petName: 'Max', status: 'Approved', createdAt: new Date('2023-10-05') },
    { id: 3, applicantName: 'Alice Johnson', petName: 'Charlie', status: 'Pending', createdAt: new Date('2023-10-10') },
    { id: 4, applicantName: 'Bob Brown', petName: 'Lucy', status: 'Rejected', createdAt: new Date('2023-10-15') },
  ];

  // Calculate statistics
  const totalPets = pets.length;
  const availablePets = pets.filter(pet => pet.status === 'Available').length;
  const pendingRequests = adoptionRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = adoptionRequests.filter(req => req.status === 'Approved').length;

  // Get recent adoption requests
  const recentRequests = [...adoptionRequests]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <PawPrint className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Pets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalPets}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/pets-listing" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all pets
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Pets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{availablePets}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/pets-listing" className="font-medium text-indigo-600 hover:text-indigo-500">
                Manage listings
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{pendingRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests" className="font-medium text-indigo-600 hover:text-indigo-500">
                Review requests
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved Adoptions</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{approvedRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all adoptions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Adoption Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Adoption Requests</h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of the most recent adoption requests for your pets.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <li key={request.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                          request.status === 'Pending' ? 'bg-yellow-100' : 
                          request.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {request.status === 'Pending' ? (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          ) : request.status === 'Approved' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.applicantName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Requesting to adopt <span className="font-medium">{request.petName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                      <Link
                        to="/requests"
                        className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No recent adoption requests.
              </li>
            )}
          </ul>
        </div>
        {recentRequests.length > 0 && (
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all requests
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
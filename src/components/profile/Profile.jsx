import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Calendar, Edit, PawPrint, Heart, Settings, LogOut } from 'lucide-react';

// Mock data for the user profile
const userData = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'April 2023',
    bio: 'Animal lover and proud pet parent. I believe every pet deserves a loving home and am passionate about animal welfare and rescue.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    adoptedPets: [
        {
            id: 1,
            name: 'Bella',
            type: 'Dog',
            breed: 'Golden Retriever',
            age: '3 years',
            adoptedDate: 'April 15, 2023',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=612&q=80'
        }
    ],
    favoritePets: [
        {
            id: 2,
            name: 'Luna',
            type: 'Cat',
            breed: 'Tabby',
            age: '1 year',
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        },
        {
            id: 3,
            name: 'Thumper',
            type: 'Rabbit',
            breed: 'Lop',
            age: '8 months',
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        },
        {
            id: 4,
            name: 'Max',
            type: 'Dog',
            breed: 'Beagle',
            age: '2 years',
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=639&q=80'
        }
    ],
    applications: [
        {
            id: 1,
            petName: 'Luna',
            status: 'In Review',
            submittedDate: 'June 10, 2024',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        }
    ]
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">


                    {/* Main Content */}
                    <div className="mt-8 lg:mt-0 lg:col-span-9">
                        {activeTab === 'profile' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your personal information and contact details.
                                    </p>
                                </div>

                                <div className="px-6 py-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                                            <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                                            <div className="mt-1 flex items-center text-sm text-gray-900">
                                                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                                {userData.email}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                                            <div className="mt-1 flex items-center text-sm text-gray-900">
                                                <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                                {userData.phone}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                            <div className="mt-1 flex items-center text-sm text-gray-900">
                                                <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                                {userData.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                                        <p className="mt-1 text-sm text-gray-900">{userData.bio}</p>
                                    </div>

                                    <div className="mt-6">
                                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'adopted' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">My Adopted Pets</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        The furry friends who have found their forever home with you.
                                    </p>
                                </div>

                                <div className="px-6 py-5">
                                    {userData.adoptedPets.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {userData.adoptedPets.map(pet => (
                                                <div key={pet.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="h-48 w-full relative">
                                                        <img
                                                            src={pet.image}
                                                            alt={pet.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                                            <span className="mr-2">{pet.breed}</span>
                                                            <span>•</span>
                                                            <span className="mx-2">{pet.age}</span>
                                                            <span>•</span>
                                                            <span className="ml-2">{pet.type}</span>
                                                        </div>
                                                        <div className="mt-3 flex items-center text-sm">
                                                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-600">Adopted on {pet.adoptedDate}</span>
                                                        </div>
                                                        <div className="mt-4 flex space-x-3">
                                                            <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                                                                View Details
                                                            </button>
                                                            <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                Care Info
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <PawPrint className="mx-auto h-12 w-12 text-gray-300" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No adopted pets yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Start your adoption journey today and find your perfect companion.
                                            </p>
                                            <div className="mt-6">
                                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                                                    Browse Available Pets
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Favorite Pets</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pets you've saved to consider for adoption.
                                    </p>
                                </div>

                                <div className="px-6 py-5">
                                    {userData.favoritePets.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {userData.favoritePets.map(pet => (
                                                <div key={pet.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="h-48 w-full relative">
                                                        <img
                                                            src={pet.image}
                                                            alt={pet.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-red-500 hover:bg-red-50">
                                                            <Heart className="h-5 w-5 fill-current" />
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                {pet.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                                            <span className="mr-2">{pet.breed}</span>
                                                            <span>•</span>
                                                            <span className="mx-2">{pet.age}</span>
                                                            <span>•</span>
                                                            <span className="ml-2">{pet.type}</span>
                                                        </div>
                                                        <div className="mt-4 flex space-x-3">
                                                            <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                                                                View Details
                                                            </button>
                                                            <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                                                Apply to Adopt
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Heart className="mx-auto h-12 w-12 text-gray-300" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No favorite pets yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Save pets you're interested in to your favorites list.
                                            </p>
                                            <div className="mt-6">
                                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                                                    Browse Available Pets
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">My Applications</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Track the status of your adoption applications.
                                    </p>
                                </div>

                                <div className="px-6 py-5">
                                    {userData.applications.length > 0 ? (
                                        <div className="overflow-hidden">
                                            <ul className="divide-y divide-gray-200">
                                                {userData.applications.map(application => (
                                                    <li key={application.id} className="py-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex-shrink-0 h-16 w-16">
                                                                <img
                                                                    src={application.petImage}
                                                                    alt={application.petName}
                                                                    className="h-16 w-16 rounded-md object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {application.petName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Submitted on {application.submittedDate}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.status === 'Approved'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : application.status === 'Rejected'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {application.status}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                                                    View Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Start the adoption process by applying for a pet.
                                            </p>
                                            <div className="mt-6">
                                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                                                    Browse Available Pets
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your account preferences and settings.
                                    </p>
                                </div>

                                <div className="px-6 py-5 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                        <div className="mt-2 space-y-4">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="notifications-new-pets"
                                                        name="notifications-new-pets"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="notifications-new-pets" className="font-medium text-gray-700">New pets that match my preferences</label>
                                                    <p className="text-gray-500">Get notified when new pets that match your preferences are available for adoption.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="notifications-application-updates"
                                                        name="notifications-application-updates"
                                                        type="checkbox"
                                                        defaultChecked
                                                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="notifications-application-updates" className="font-medium text-gray-700">Application status updates</label>
                                                    <p className="text-gray-500">Receive notifications when there are updates to your adoption applications.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="notifications-newsletter"
                                                        name="notifications-newsletter"
                                                        type="checkbox"
                                                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="notifications-newsletter" className="font-medium text-gray-700">Newsletter and updates</label>
                                                    <p className="text-gray-500">Receive our monthly newsletter with adoption success stories and pet care tips.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900">Password</h4>
                                        <div className="mt-2">
                                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-5 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Once you delete your account, you will lose all data associated with it.
                                        </p>
                                        <div className="mt-2">
                                            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
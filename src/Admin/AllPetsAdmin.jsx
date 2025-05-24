import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Tag, Image, Divider } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { PawPrint, Home, Users, Clock, ListChecks, Shield, FileText } from 'lucide-react';
import Sidebar from '../components/ui/Sidebar';
import { AppContent } from '../context/AppContext';

const AllPetsAdmin = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { backendUrl } = useContext(AppContent);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/pets/all-pets`);
                const data = await response.json();
                setPets(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pets:', error);
                setLoading(false);
            }
        };
        fetchPets();
    }, []);


    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield },
        { path: "/admin/manage-blogs", label: "Manage Blog", icon: FileText }
    ];

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'image',
            width: 100,
            render: (imageUrl) => (
                <div className="flex justify-center">
                    <Image
                        src={imageUrl || '/placeholder-pet.jpg'}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover border border-gray-200"
                        preview={false}
                    />
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Details',
            key: 'details',
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Species:</span>
                        <span>{record.species}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Breed:</span>
                        <span>{record.breed}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag
                    color={status === 'Available' ? 'green' : 'orange'}
                    className="rounded-full px-3 py-1"
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Vendor',
            dataIndex: ['vendorId', 'organization'],
            key: 'vendor',
            render: (org) => <span className="text-gray-600">{org || 'N/A'}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined className="text-blue-500" />}
                    onClick={() => {
                        setSelectedPet(record);
                        setModalVisible(true);
                    }}
                    className="hover:bg-blue-50 rounded-full"
                />
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />

            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">All Pets</h1>

                <div className="bg-white rounded-lg border border-gray-200">
                    <Table
                        columns={columns}
                        dataSource={pets}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        className="simple-table"
                        rowClassName="hover:bg-gray-50"
                    />
                </div>

                {/* Pet Details Modal */}
                <Modal
                    title={<span className="text-xl font-semibold">Pet Details</span>}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={800}
                    centered
                >
                    {selectedPet && (
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="w-full md:w-1/3">
                                    <Image
                                        src={selectedPet.imageUrl || '/placeholder-pet.jpg'}
                                        width="100%"
                                        className="rounded-lg border border-gray-200"
                                        alt={selectedPet.name}
                                    />
                                </div>

                                <div className="w-full md:w-2/3 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedPet.name}</h2>
                                        <div className="flex items-center mt-1">
                                            <Tag
                                                color={selectedPet.status === 'Available' ? 'green' : 'orange'}
                                                className="rounded-full px-3 py-1"
                                            >
                                                {selectedPet.status}
                                            </Tag>
                                        </div>
                                    </div>

                                    <Divider className="my-2" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Species</p>
                                            <p className="font-medium">{selectedPet.species}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Breed</p>
                                            <p className="font-medium">{selectedPet.breed}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Age</p>
                                            <p className="font-medium">{selectedPet.age} years</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium">{selectedPet.gender}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Size</p>
                                            <p className="font-medium">{selectedPet.size}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Weight</p>
                                            <p className="font-medium">{selectedPet.weight} kg</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-2" />

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700">{selectedPet.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Personality Traits</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPet.traits?.map(trait => (
                                                <Tag key={trait} className="rounded-full px-3 py-1 bg-blue-50 text-blue-600">
                                                    {trait}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Good With</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPet.goodWith?.map(item => (
                                                <Tag key={item} className="rounded-full px-3 py-1 bg-green-50 text-green-600">
                                                    {item}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-3">Vendor Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Organization</p>
                                            <p className="font-medium">{selectedPet.vendorId?.organization || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contact</p>
                                            <p className="font-medium">{selectedPet.vendorId?.contact || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedPet.vendorId?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium">{selectedPet.vendorId?.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>

            {/* Add some global styles */}
            <style jsx global>{`
                .simple-table .ant-table-thead > tr > th {
                    background-color: white;
                    color: #374151;
                    font-weight: 500;
                    border-bottom: 1px solid #e5e7eb;
                }
                .simple-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: middle;
                }
                .simple-table .ant-table-tbody > tr:hover > td {
                    background-color: #f8fafc !important;
                }
                .simple-table .ant-table-container {
                    border: none !important;
                }
            `}</style>
        </div>
    );
};

export default AllPetsAdmin;
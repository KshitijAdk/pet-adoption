import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Tag, Image, Divider, message } from 'antd';
import { EyeOutlined, LockOutlined, UnlockOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { PawPrint, Home, Users, Clock, ListChecks, Shield, FileText } from 'lucide-react';
import Sidebar from '../components/ui/Sidebar';
import FeedbackModal from '../components/ui/FeedbackModal';
import { AppContent } from '../context/AppContext';

const AllPetsAdmin = () => {
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]); // State for filtered pets
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [petToLock, setPetToLock] = useState(null);
    const { backendUrl } = useContext(AppContent);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/pets/all-pets`);
                const data = await response.json();
                setPets(data.data || []);
                setFilteredPets(data.data || []); // Initialize filtered pets
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pets:', error);
                messageApi.error('Failed to fetch pets');
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    // Update filtered pets whenever pets or search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPets(pets);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredPets(
                pets.filter(
                    (pet) =>
                        (pet.name?.toLowerCase().includes(lowerCaseQuery) || false) ||
                        (pet.species?.toLowerCase().includes(lowerCaseQuery) || false) ||
                        (pet.breed?.toLowerCase().includes(lowerCaseQuery) || false)
                )
            );
        }
    }, [searchQuery, pets]);

    const handleLockUnlock = async (petId, isLocked, feedback = '') => {
        try {
            const endpoint = isLocked ? `${backendUrl}/api/pets/unlock` : `${backendUrl}/api/pets/lock`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ petId, feedback }),
            });
            if (response.ok) {
                setPets(pets.map(pet =>
                    pet._id === petId ? { ...pet, isLocked: !isLocked } : pet
                ));
                setFilteredPets(filteredPets.map(pet =>
                    pet._id === petId ? { ...pet, isLocked: !isLocked } : pet
                ));
                messageApi.success(`Pet ${isLocked ? 'unlocked' : 'locked'} successfully`);
            } else {
                throw new Error('Failed to update lock status');
            }
        } catch (error) {
            console.error('Error updating lock status:', error);
            messageApi.error('Failed to update lock status');
        }
    };

    const handleLockClick = (petId, isLocked) => {
        if (!isLocked) {
            setPetToLock({ petId, isLocked });
            setFeedbackModalVisible(true);
        } else {
            handleLockUnlock(petId, isLocked);
        }
    };

    const handleFeedbackSubmit = (feedback) => {
        if (petToLock) {
            handleLockUnlock(petToLock.petId, petToLock.isLocked, feedback);
            setFeedbackModalVisible(false);
            setPetToLock(null);
        }
    };

    const refreshPets = () => {
        setLoading(true);
        setSearchQuery(''); // Clear search query on refresh

        fetch(`${backendUrl}/api/pets/all-pets`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch pets');
                return response.json();
            })
            .then(data => {
                setPets(data.data || []);
                setFilteredPets(data.data || []);
                setLoading(false);
                messageApi.success('Pets refreshed successfully!');
            })
            .catch(error => {
                console.error('Error fetching pets:', error);
                messageApi.error('Failed to fetch pets');
                setLoading(false);
            });
    };

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
            width: 80,
            fixed: 'left',
            render: (imageUrl) => (
                <div className="flex justify-center">
                    <Image
                        src={imageUrl || '/placeholder-pet.jpg'}
                        width={50}
                        height={50}
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
            width: 120,
            fixed: 'left',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Details',
            key: 'details',
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-start">
                        <span className="text-gray-500 mr-2 min-w-[60px]">Species:</span>
                        <span>{record.species}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 mr-2 min-w-[60px]">Breed:</span>
                        <span>{record.breed}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 150,
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    <Tag
                        color={record.status === 'Available' ? 'green' : 'orange'}
                        className="rounded-full px-3 py-1 w-fit"
                    >
                        {record.status}
                    </Tag>
                    {record.isLocked && (
                        <Tag
                            color="red"
                            className="rounded-full px-3 py-1 w-fit"
                        >
                            Locked
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Vendor',
            dataIndex: ['vendorId', 'organization'],
            key: 'vendor',
            width: 150,
            render: (org) => <span className="text-gray-600 truncate">{org || 'N/A'}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button
                        type="text"
                        icon={<EyeOutlined className="text-blue-500" />}
                        onClick={() => {
                            setSelectedPet(record);
                            setModalVisible(true);
                        }}
                        className="hover:bg-blue-50 rounded-full"
                    />
                    <Button
                        type="text"
                        icon={record.isLocked ?
                            <UnlockOutlined className="text-green-500" /> :
                            <LockOutlined className="text-red-500" />
                        }
                        onClick={() => handleLockClick(record._id, record.isLocked)}
                        className="hover:bg-gray-50 rounded-full"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {contextHolder}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <div className="flex-1 p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">All Pets</h1>
                    <div className="flex items-center gap-3">
                        <div className="relative w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, species, or breed..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <Button
                            onClick={refreshPets}
                            className="flex items-center gap-2 border border-gray-300 rounded-lg text-blue-500 hover:bg-blue-50"
                            title="Refresh Pets"
                        >
                            <ReloadOutlined />
                            <span>Refresh</span>
                        </Button>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredPets}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        className="responsive-table"
                        rowClassName="hover:bg-gray-50"
                        scroll={{ x: 'max-content' }}
                        size="middle"
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
                                        <div className="flex items-center mt-1 gap-2">
                                            <Tag
                                                color={selectedPet.status === 'Available' ? 'green' : 'orange'}
                                                className="rounded-full px-3 py-1"
                                            >
                                                {selectedPet.status}
                                            </Tag>
                                            {selectedPet.isLocked && (
                                                <Tag
                                                    color="red"
                                                    className="rounded-full px-3 py-1"
                                                >
                                                    Locked
                                                </Tag>
                                            )}
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
                {/* Feedback Modal for Locking */}
                <FeedbackModal
                    isOpen={feedbackModalVisible}
                    onClose={() => {
                        setFeedbackModalVisible(false);
                        setPetToLock(null);
                    }}
                    onSubmit={handleFeedbackSubmit}
                    title="Reason for Locking"
                    description="Please provide a reason for locking this pet."
                    placeholder="Enter the reason for locking..."
                />
            </div>
            <style jsx global>{`
                .responsive-table .ant-table-thead > tr > th {
                    background-color: white;
                    color: #374151;
                    font-weight: 500;
                    border-bottom: 1px solid #e5e7eb;
                    white-space: nowrap;
                }
                .responsive-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: middle;
                }
                .responsive-table .ant-table-tbody > tr:hover > td {
                    background-color: #f8fafc !important;
                }
                .responsive-table .ant-table-container {
                    border: none !important;
                }
                .responsive-table .ant-table-body {
                    overflow-x: auto !important;
                }
                @media (max-width: 768px) {
                    .responsive-table .ant-table {
                        width: 100%;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default AllPetsAdmin;
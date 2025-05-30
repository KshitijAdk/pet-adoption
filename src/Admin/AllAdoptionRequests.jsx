import { useState, useEffect, useContext } from "react";
import Table from "../components/ui/Table";
import { Eye, CheckCircle, XCircle, Clock, Calendar, Home, Users, PawPrint, Shield, ListChecks, FileText, Search, RefreshCw } from "lucide-react";
import { AppContent } from "../context/AppContext";
import { AdoptionRequestModal } from "./DetailsModal";
import Sidebar from "../components/ui/Sidebar";
import { message } from 'antd';

const AllAdoptionRequests = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State for filtered adoption requests
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const { backendUrl } = useContext(AppContent);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    // Fetch adoption requests
    useEffect(() => {
        fetchAdoptionRequests();
    }, []);

    // Update filtered data whenever data or search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(data.map(item => ({
                ...item,
                petName: item?.pet?.name || "N/A",
                petSpecies: item?.pet?.species || "N/A",
                applicantName: item?.applicant?.name || "N/A",
                createdAt: item?.createdAt || new Date().toISOString()
            })));
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                data
                    .filter(
                        (item) =>
                            (item?.pet?.name?.toLowerCase().includes(lowerCaseQuery) || false) ||
                            (item?.pet?.species?.toLowerCase().includes(lowerCaseQuery) || false) ||
                            (item?.applicant?.name?.toLowerCase().includes(lowerCaseQuery) || false)
                    )
                    .map(item => ({
                        ...item,
                        petName: item?.pet?.name || "N/A",
                        petSpecies: item?.pet?.species || "N/A",
                        applicantName: item?.applicant?.name || "N/A",
                        createdAt: item?.createdAt || new Date().toISOString()
                    }))
            );
        }
    }, [searchQuery, data]);

    const fetchAdoptionRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/adoption/adoption-requests`);
            if (!response.ok) {
                throw new Error(`Failed to fetch adoption requests: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();

            if (!result || !Array.isArray(result.data)) {
                throw new Error("Invalid data format received from API");
            }

            setData(result.data);
            messageApi.success('Adoption requests fetched successfully!');
        } catch (err) {
            setError(err.message);
            setData([]);
            messageApi.error('Failed to fetch adoption requests');
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns = [
        { key: "petName", label: "Pet Name" },
        { key: "petSpecies", label: "Species" },
        { key: "applicantName", label: "Applicant Name" },
        {
            key: "status",
            label: "Status",
            customRender: (row) => {
                const status = row.status?.toLowerCase();
                let statusClass = "";

                if (status === "approved") {
                    statusClass = "bg-green-100 text-green-800";
                } else if (status === "rejected") {
                    statusClass = "bg-red-100 text-red-800";
                } else {
                    statusClass = "bg-yellow-100 text-yellow-800";
                }

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {row.status || "Pending"}
                    </span>
                );
            }
        },
        {
            key: "createdAt",
            label: "Created At",
            customRender: (row) => {
                const date = row.createdAt ? new Date(row.createdAt) : new Date();
                return (
                    <div className="flex items-center justify-center space-x-1">
                        <Calendar size={12} />
                        <span>{date.toLocaleDateString()}</span>
                    </div>
                );
            }
        },
    ];

    // Table actions
    const actions = [
        {
            key: "view",
            label: "View Details",
            icon: Eye,
            className: "text-blue-500 hover:text-blue-700",
            onClick: (row) => {
                const request = data.find(item => item.adoptionId === row.adoptionId);
                if (request) {
                    setSelectedRequest(request);
                }
            },
        },
    ];

    const closeModal = () => {
        setSelectedRequest(null);
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

    return (
        <div className="flex h-screen">
            {contextHolder}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Adoption Requests</h1>
                    <div className="flex items-center gap-3">
                        <div className="relative w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by pet name, species, or applicant..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={fetchAdoptionRequests}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg border border-gray-300 flex items-center gap-2"
                            title="Refresh Adoption Requests"
                        >
                            <RefreshCw size={18} />
                            <span className="text-sm">Refresh</span>
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <Table
                        columns={columns}
                        data={filteredData}
                        loading={loading}
                        error={error}
                        actions={actions}
                        emptyMessage="No adoption requests found."
                        statusConfig={{
                            key: "status",
                            icons: {
                                approved: { icon: CheckCircle, colorClass: "bg-green-100 text-green-700 border-green-500" },
                                rejected: { icon: XCircle, colorClass: "bg-red-100 text-red-700 border-red-500" },
                                pending: { icon: Clock, colorClass: "bg-yellow-100 text-yellow-700 border-yellow-500" },
                            },
                        }}
                    />
                </div>
                {selectedRequest && (
                    <AdoptionRequestModal
                        request={selectedRequest}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

export default AllAdoptionRequests;
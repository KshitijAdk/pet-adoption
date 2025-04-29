import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Calendar, Clock, Home, Shield, Users, ListChecks, Eye, PawPrint } from "lucide-react";
import { VendorDetailsModal } from "./DetailsModal";
import Table from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import BigModal from "../components/ui/BigModal";

const ManageVendors = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield }
    ];

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/vendors/all-vendor-applications");
                if (!response.ok) {
                    throw new Error("Failed to fetch vendors");
                }
                const data = await response.json();
                setVendors(data.data || []);
            } catch (err) {
                setError(err.message);
                setVendors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const approveVendor = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/vendors/approve-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to approve vendor");
            setVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor._id === vendorId ? { ...vendor, status: "Approved" } : vendor
                )
            );
        } catch (error) {
            console.error(error);
            alert("Error approving vendor");
        }
    };

    const rejectVendor = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/vendors/reject-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to reject vendor");
            setVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor._id === vendorId ? { ...vendor, status: "Rejected" } : vendor
                )
            );
        } catch (error) {
            console.error(error);
            alert("Error rejecting vendor");
        }
    };

    const refreshVendors = () => {
        setLoading(true);
        setError(null);

        fetch("http://localhost:3000/api/vendors/all-vendor-applications")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch vendors");
                return response.json();
            })
            .then(data => {
                setVendors(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const openModal = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedVendor(null);
        setShowModal(false);
    };

    const columns = [
        {
            key: "fullName",
            label: "Applicant",
            customRender: (vendor) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {vendor.image ? (
                            <img src={vendor.image} alt="Vendor" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-semibold text-gray-600">{vendor.fullName?.charAt(0) || 'N/A'}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{vendor.fullName}</p>
                        <p className="text-xs text-gray-500">{vendor.email}</p>
                    </div>
                </div>
            )
        },
        { key: "contact", label: "Business Details" },
        { key: "organization", label: "Organization" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Date" }
    ];

    const dropdownActions = [
        {
            key: "approve",
            label: "Approve",
            icon: CheckCircle,
            onClick: (vendor) => approveVendor(vendor._id)
        },
        {
            key: "reject",
            label: "Reject",
            icon: XCircle,
            onClick: (vendor) => rejectVendor(vendor._id)
        },
        {
            key: "view",
            label: "View Details",
            icon: Eye,
            onClick: openModal
        }
    ];

    const statusConfig = {
        key: 'status',
        icons: {
            approved: { icon: CheckCircle, colorClass: 'bg-green-100 text-green-700 border-green-500' },
            rejected: { icon: XCircle, colorClass: 'bg-red-100 text-red-700 border-red-500' },
            pending: { icon: Clock, colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-500' }
        }
    };

    const dateConfig = {
        key: 'createdAt',
        icon: Calendar
    };

    // Empty state for all vendor applications
    const vendorsEmptyState = (
        <EmptyState
            icon={ListChecks}
            title="No vendor applications found"
            description="No applications have been submitted yet or they may have been removed."
            actionText="Refresh List"
            actionType="button"
            actionOnClick={refreshVendors}
            iconClassName="h-12 w-12 text-amber-500"
            actionClassName="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
        />
    );

    return (
        <div className="flex h-screen">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="p-6 flex-1 flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Vendors</h1>

                    <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col">
                        <div className="flex-1 overflow-auto">
                            <Table
                                columns={columns}
                                data={vendors}
                                loading={loading}
                                error={error}
                                emptyMessage={vendorsEmptyState}
                                onRowClick={openModal}
                                dropdownActions={dropdownActions}
                                statusConfig={statusConfig}
                                dateConfig={dateConfig}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <BigModal isOpen={showModal} onClose={closeModal} title="Vendor Application Details">
                <VendorDetailsModal vendor={selectedVendor} onClose={closeModal} />
            </BigModal>
        </div>
    );
};

export default ManageVendors;
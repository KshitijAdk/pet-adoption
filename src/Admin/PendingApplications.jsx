import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect, useContext } from "react";
import {
    Calendar,
    Clock,
    ThumbsUp,
    ThumbsDown,
    Home,
    Users,
    ListChecks,
    Eye,
    PawPrint,
    Shield
} from "lucide-react";
import BigModal from "../components/ui/BigModal";
import Table from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import { VendorDetailsModal } from "./DetailsModal";
import { AppContent } from "../context/AppContext";

const PendingApplications = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { backendUrl } = useContext(AppContent);

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield }
    ];

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/vendors/pending-vendors`);
                if (!response.ok) throw new Error("Failed to fetch vendors");
                const data = await response.json();
                setVendors(data.vendors || []); // Ensure vendors is always set to an array
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const approveVendor = async (vendorId) => {
        try {
            const response = await fetch(`${backendUrl}/api/vendors/approve-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to approve vendor");

            setVendors((prev) =>
                prev.map((v) => (v._id === vendorId ? { ...v, status: "Approved" } : v))
            );
        } catch (err) {
            alert("Error approving vendor");
        }
    };

    const rejectVendor = async (vendorId) => {
        try {
            const response = await fetch(`${backendUrl}/api/vendors/reject-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to reject vendor");

            setVendors((prev) =>
                prev.map((v) => (v._id === vendorId ? { ...v, status: "Rejected" } : v))
            );
        } catch (err) {
            alert("Error rejecting vendor");
        }
    };

    const openModal = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedVendor(null);
        setShowModal(false);
    };

    const refreshApplications = () => {
        setLoading(true);
        setError(null);

        window.location.reload(); // Refresh the page to get updated data
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
        { key: "contact", label: "Contact" },
        { key: "organization", label: "Organization" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Date" }
    ];

    const dropdownActions = [
        {
            key: "approve",
            label: "Approve",
            icon: ThumbsUp,
            onClick: (vendor) => approveVendor(vendor._id)
        },
        {
            key: "reject",
            label: "Reject",
            icon: ThumbsDown,
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
            approved: { icon: ThumbsUp, colorClass: 'bg-green-100 text-green-700 border-green-500' },
            rejected: { icon: ThumbsDown, colorClass: 'bg-red-100 text-red-700 border-red-500' },
            pending: { icon: Clock, colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-500' }
        }
    };

    const dateConfig = {
        key: 'createdAt',
        icon: Calendar
    };

    // Empty state for pending applications
    const pendingEmptyState = (
        <EmptyState
            icon={Clock}
            title="No pending vendor applications found"
            description="Check back later for new applications or take action on pending ones."
            actionText="Refresh Applications"
            actionType="button"
            actionOnClick={refreshApplications}
            iconClassName="h-12 w-12 text-yellow-500"
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
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Applications</h1>

                    <Table
                        columns={columns}
                        data={vendors}
                        loading={loading}
                        error={error}
                        emptyMessage={pendingEmptyState}
                        onRowClick={openModal}
                        dropdownActions={dropdownActions}
                        statusConfig={statusConfig}
                        dateConfig={dateConfig}
                    />
                </div>

                <BigModal isOpen={showModal} onClose={closeModal} title="Vendor Application Details">
                    <VendorDetailsModal vendor={selectedVendor} onClose={closeModal} />
                </BigModal>
            </div>
        </div>
    );
};

export default PendingApplications;
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import Loading from "../components/ui/Loading";

const VendorRoute = ({ children }) => {
    const { isLoggedin, userData, loading } = useContext(AppContent);

    if (loading) {
        return <Loading text="Checking vendor status..." />;
    }

    if (!isLoggedin || userData?.role !== "vendor") {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default VendorRoute;
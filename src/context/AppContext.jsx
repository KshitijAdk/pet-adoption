import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Set default to null
    const [loading, setLoading] = useState(true); // Add loading state

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            getUserData(); // ✅ Fetch user data if token exists
        } else {
            setIsLoggedin(false);
            setUserData(null);
            setLoading(false); // Stop loading if no token
        }
    }, []);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`)
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                withCredentials: true, // ✅ Important! Ensures cookies (token) are sent
            });

            if (data.success) {
                setUserData(data.userData);
                setIsLoggedin(true);
            } else {
                toast.error(data.message);
                setIsLoggedin(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setIsLoggedin(false);
        } finally {
            setLoading(false); // Stop loading once the request completes
        }
    };

    const value = {
        backendUrl,
        isLoggedin,
        userData,
        setUserData,
        getUserData,
        loading, // Pass loading state to context
    };

    return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};

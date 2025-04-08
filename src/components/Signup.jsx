import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "./ui/button";
import InputField from "./ui/InputField";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import ToastComponent from './ui/ToastComponent';
import Loading from "./ui/Loading";

const Signup = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);

    const togglePasswordVisibility = () => setIsPasswordShown((prev) => !prev);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => password.length >= 6;

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email.");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Signup successful! Sending OTP...");
                await sendOtp(data.userId);
            } else {
                toast.error(data.message || "Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async (userId) => {
        try {
            const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                toast.success("OTP sent! Check your email.");
                setTimeout(() => navigate("/email-verification"), 2000);
            } else {
                toast.error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("OTP sending error:", error);
            toast.error("Failed to send OTP. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md">
                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-amber-100 p-3 rounded-full">
                            <PawPrint size={28} className="text-amber-600" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-1">Join us in helping pets find their homes</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                            <InputField
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="pl-10 w-full h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                            <InputField
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 w-full h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                            <InputField
                                id="password"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 w-full h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600"
                            >
                                {isPasswordShown ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button
                            text={isLoading ? "Creating Account..." : "Create Account"}
                            type="submit"
                            variant="primary"
                            className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-all duration-200 disabled:opacity-50"
                            disabled={isLoading}
                        />

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 text-gray-400 bg-white">or</span>
                            </div>
                        </div>

                        <Button
                            text="Continue with Google"
                            variant="secondary"
                            className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                        />

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                            >
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            {isLoading && <Loading text="Creating your account..." />}
            <ToastComponent />
        </div>
    );
};

export default Signup;
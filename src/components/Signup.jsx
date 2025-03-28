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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300 p-4">
            <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-purple-100 p-3 rounded-2xl">
                        <PawPrint size={32} className="text-purple-600" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
                        Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Join us in helping pets find their forever homes
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <InputField
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <InputField
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <InputField
                                id="password"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {isPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        text={isLoading ? "Creating Account..." : "Create Account"}
                        type="submit"
                        variant="primary"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50"
                        disabled={isLoading}
                    />

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-gray-500 bg-white">or continue with</span>
                        </div>
                    </div>

                    <Button
                        text="Continue with Google"
                        variant="secondary"
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm"
                    />

                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                        >
                            Sign in
                        </a>
                    </p>
                </form>
            </div>

            {isLoading && <Loading text="Creating your account..." />}
            <ToastComponent />
        </div>
    );
};

export default Signup;
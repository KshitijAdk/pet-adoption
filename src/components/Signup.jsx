import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, User, Mail, Lock, Check, X, ChevronDown, ChevronUp } from "lucide-react";
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
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);

    const togglePasswordVisibility = () => setIsPasswordShown((prev) => !prev);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    // Password validation checks
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidPassword = hasMinLength && hasLetter && hasSpecialChar;

    const handlePasswordFocus = () => {
        setShowPasswordRequirements(true);
    };

    const handlePasswordBlur = () => {
        if (password.length === 0) {
            setShowPasswordRequirements(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length > 0) {
            setShowPasswordRequirements(true);
        }
    };

    const togglePasswordRequirements = () => {
        setShowPasswordRequirements(!showPasswordRequirements);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email.");
            return;
        }

        if (!isValidPassword) {
            toast.error("Please meet all password requirements.");
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

    // Validation icon component
    const ValidationIcon = ({ isValid }) => (
        <span className={isValid ? "text-green-500" : "text-red-500"}>
            {isValid ? <Check size={14} /> : <X size={14} />}
        </span>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
                <div className="px-8 pt-10 pb-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-4 rounded-full shadow-md">
                            <PawPrint size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Welcome to NayaSathi</h2>
                        <p className="text-gray-500 mt-2 text-sm">Create an account in seconds</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <InputField
                            id="name"
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={User}
                            iconPosition="left"
                            className="h-12 rounded-xl"
                            required
                        />

                        <InputField
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            iconPosition="left"
                            className="h-12 rounded-xl"
                            required
                        />

                        <div className="relative">
                            <InputField
                                id="password"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Create Password"
                                value={password}
                                onChange={handlePasswordChange}
                                onFocus={handlePasswordFocus}
                                onBlur={handlePasswordBlur}
                                icon={Lock}
                                iconPosition="left"
                                isPasswordShown={isPasswordShown}
                                togglePasswordVisibility={togglePasswordVisibility}
                                className="h-12 rounded-xl"
                                required
                            />
                            {(password.length > 0 || showPasswordRequirements) && (
                                <button
                                    type="button"
                                    onClick={togglePasswordRequirements}
                                    className="absolute right-10 top-3 text-gray-400 hover:text-gray-600"
                                >
                                </button>
                            )}
                        </div>

                        {/* Password requirements - only shown when password field is focused/has content */}
                        {(password.length > 0 || showPasswordRequirements) && showPasswordRequirements && (
                            <div className="mt-2 space-y-1 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 font-medium">Password must contain:</p>
                                <div className="flex items-center space-x-2">
                                    <ValidationIcon isValid={hasMinLength} />
                                    <span className={`text-xs ${hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
                                        At least 8 characters
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ValidationIcon isValid={hasLetter} />
                                    <span className={`text-xs ${hasLetter ? 'text-green-500' : 'text-gray-500'}`}>
                                        At least one letter
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ValidationIcon isValid={hasSpecialChar} />
                                    <span className={`text-xs ${hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                                        At least one special character
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button
                            text={isLoading ? "Creating Account..." : "Create Account"}
                            type="submit"
                            variant="primary"
                            className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 mt-4 h-12 shadow-sm ${!isValidPassword ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            disabled={isLoading || !isValidPassword}
                        />

                        {/* Social Login */}
                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-gray-400 text-sm">or</span>
                            </div>
                        </div>

                        <Button
                            text="Continue with Google"
                            variant="secondary"
                            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 h-12 shadow-sm mt-4"
                        />

                        {/* Login Link */}
                        <p className="text-center text-gray-500 text-sm mt-6">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
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
import React, { useContext, useState, useEffect } from "react";
import { PawPrint, User, Mail, Lock, Check, X } from "lucide-react";
import Button from "./ui/button";
import InputField from "./ui/InputField";
import { AppContent } from "../context/AppContext";
import { message } from 'antd';
import Loading from "./ui/Loading";
import OAuth from "./OAuth";

const Signup = () => {
    const { backendUrl } = useContext(AppContent);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    // Verification states
    const [showVerification, setShowVerification] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [timeLeft, setTimeLeft] = useState(180);

    const [isLoading, setIsLoading] = useState(false);

    // Password validation
    const validations = {
        hasMinLength: password.length >= 8,
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const isValidPassword = Object.values(validations).every(Boolean);

    // OTP expiry countdown
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Resend countdown
    useEffect(() => {
        if (!resendDisabled || countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, resendDisabled]);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isValidPassword) {
            return message.error("Password must include a letter, number, and special character.");
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409 && data.isResend) {
                    message.info("Existing verification found. New OTP sent.");
                    setShowVerification(true);
                    return;
                }
                throw new Error(data.message || "Registration failed");
            }

            message.success("OTP sent to your email!");
            setShowVerification(true);
            setTimeLeft(180);
        } catch (error) {
            message.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value, event) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        } else if (event.key === "Backspace" && !value && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").split("").slice(0, 6);
        setOtp([...digits, ...Array(6 - digits.length).fill("")]);
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length < 6) return message.error("Please enter the full 6-digit OTP.");
        if (timeLeft <= 0) return message.error("OTP has expired. Please request a new one.");

        setIsLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Verification failed");

            message.success("Email verified! Redirecting...");
            setTimeout(() => (window.location.href = "/login"), 1500);
        } catch (error) {
            message.error(error.message || "Invalid OTP. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendDisabled(true);
        setCountdown(30);
        setOtp(["", "", "", "", "", ""]);

        try {
            const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Resend failed");

            setTimeLeft(180);
            message.success("New OTP sent!");
        } catch (error) {
            message.error(error.message || "Failed to resend OTP.");
            setResendDisabled(false);
        }
    };

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const ValidationIcon = ({ isValid }) => (
        <span className={isValid ? "text-green-500" : "text-red-500"}>
            {isValid ? <Check size={14} /> : <X size={14} />}
        </span>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
                    {!showVerification ? (
                        <>
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-3 sm:p-4 rounded-full shadow-md">
                                    <PawPrint size={24} className="text-white sm:h-8 sm:w-8" />
                                </div>
                            </div>
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome to NayaSathi</h2>
                                <p className="text-gray-500 mt-2 text-xs sm:text-sm">Create an account in seconds</p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
                                <InputField
                                    id="name"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    icon={User}
                                    required
                                    className="text-sm sm:text-base"
                                />
                                <InputField
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={Mail}
                                    required
                                    className="text-sm sm:text-base"
                                />
                                <InputField
                                    id="password"
                                    type={isPasswordShown ? "text" : "password"}
                                    placeholder="Create Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setShowPasswordRequirements(true)}
                                    onBlur={() => password.length === 0 && setShowPasswordRequirements(false)}
                                    icon={Lock}
                                    isPasswordShown={isPasswordShown}
                                    togglePasswordVisibility={() => setIsPasswordShown((prev) => !prev)}
                                    required
                                    className="text-sm sm:text-base"
                                />

                                {showPasswordRequirements && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-1 text-xs sm:text-sm">
                                        <p className="font-medium text-gray-500">Password must contain:</p>
                                        {Object.entries({
                                            "At least 8 characters": validations.hasMinLength,
                                            "At least one letter": validations.hasLetter,
                                            "At least one number": validations.hasNumber,
                                            "At least one special character": validations.hasSpecialChar,
                                        }).map(([text, valid], idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <ValidationIcon isValid={valid} />
                                                <span className={valid ? "text-green-500" : "text-gray-500"}>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Button
                                    text={isLoading ? "Creating Account..." : "Create Account"}
                                    type="submit"
                                    disabled={!isValidPassword || isLoading}
                                    className="w-full h-10 sm:h-12 mt-3 sm:mt-4 text-sm sm:text-base"
                                />
                                <div className="mt-4 sm:mt-6 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-100"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-white text-gray-400 text-xs sm:text-sm">or</span>
                                    </div>
                                </div>
                                <OAuth />
                                <p className="text-xs sm:text-sm text-center text-gray-500 mt-4 sm:mt-6">
                                    Already have an account?{" "}
                                    <a href="/login" className="font-semibold text-amber-600 hover:text-amber-700">
                                        Sign in
                                    </a>
                                </p>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-3 sm:p-4 rounded-full shadow-md inline-block">
                                    <PawPrint size={24} className="text-white sm:h-8 sm:w-8" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4">Verify Your Email</h1>
                                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                                    Enter the 6-digit code sent to{" "}
                                    <span className="text-amber-600 font-semibold">{email}</span>
                                </p>
                            </div>

                            <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6" onPaste={handleOtpPaste}>
                                {otp.map((digit, idx) => (
                                    <InputField
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value, e)}
                                        onKeyDown={(e) => handleOtpChange(idx, e.target.value, e)}
                                        className="w-10 h-10 sm:w-14 sm:h-14 text-lg sm:text-2xl font-bold text-center border-2 rounded-lg"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <p
                                className={`text-center text-xs sm:text-sm ${timeLeft < 60 ? "text-red-500" : "text-gray-500"
                                    } mb-4 sm:mb-6`}
                            >
                                {timeLeft > 0
                                    ? `Code expires in ${formatTime(timeLeft)}`
                                    : "Code has expired. Please request a new one."}
                            </p>

                            <Button
                                text={isLoading ? "Verifying..." : "Verify Email"}
                                onClick={handleVerify}
                                disabled={isLoading || timeLeft <= 0}
                                className="w-full h-10 sm:h-12 mb-3 sm:mb-4 text-sm sm:text-base"
                            />

                            <div className="text-xs sm:text-sm text-center text-gray-600">
                                Didn't receive the code?{" "}
                                {resendDisabled ? (
                                    <span className="text-amber-600">Resend available in {countdown}s</span>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-amber-600 font-medium hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {isLoading && (
                <Loading text={showVerification ? "Verifying your email..." : "Creating your account..."} />
            )}
        </div>
    );
};

export default Signup;
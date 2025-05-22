import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./ui/InputField";
import Button from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { AppContent } from "../context/AppContext";
import "./styles.css";
import { message } from "antd";

export default function ResetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { backendUrl } = useContext(AppContent);
    const navigate = useNavigate();

    // Debug step changes
    useEffect(() => {
        console.log("Step changed to:", step);
    }, [step]);

    const handleSendOtp = async () => {
        if (!email) {
            message.error("Please enter a valid email address.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            message.error("Please enter a valid email format.");
            return;
        }

        try {
            const messageKey = "sendOtp";
            message.loading({ content: "Sending OTP...", key: messageKey });

            const response = await fetch(`${backendUrl}/api/auth/send-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                message.success({ content: "OTP sent to your email. Please check your inbox or spam folder.", key: messageKey });
                setStep(2); // This should now properly update the step
                setResendDisabled(true);
                startCountdown();
            } else {
                message.error({ content: data.message || "Failed to send OTP. Please try again.", key: messageKey });
            }
        } catch (error) {
            message.error({ content: "An error occurred while sending OTP. Please try again later.", key: messageKey });
            console.error("Send OTP error:", error);
        }
    };

    const startCountdown = () => {
        setCountdown(30);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOtp = async () => {
        if (!email) {
            message.error("Email is missing. Please start over.");
            setStep(1);
            return;
        }

        setResendDisabled(true);
        startCountdown();

        try {
            const messageKey = "resendOtp";
            message.loading({ content: "Resending OTP...", key: messageKey });

            const response = await fetch(`${backendUrl}/api/auth/send-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok && data.success) {
                message.success({ content: "OTP resent to your email. Please check your inbox or spam folder.", key: messageKey });
            } else {
                message.error({ content: data.message || "Failed to resend OTP. Please try again.", key: messageKey });
            }
        } catch (error) {
            message.error({ content: "An error occurred while resending OTP. Please try again later.", key: messageKey });
            console.error("Resend OTP error:", error);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            message.error("Please enter the OTP sent to your email.");
            return;
        }

        if (otp.length !== 6) {
            message.error("Please enter a valid 6-digit OTP.");
            return;
        }

        const key = "verifyOtpMessage";

        try {
            message.loading({ content: "Verifying OTP...", key });

            const response = await fetch(`${backendUrl}/api/auth/verify-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok && data.success) {
                message.success({
                    content: "OTP verified successfully! Proceed to reset your password.",
                    key,
                });
                setStep(3);
            } else {
                // Use status code to determine the specific issue if available
                let errorMsg = data.message || "Invalid OTP. Please try again.";
                message.error({ content: errorMsg, key });
            }
        } catch (error) {
            message.error({
                content: "An error occurred while verifying OTP. Please try again later.",
                key,
            });
            console.error("Verify OTP error:", error);
        }
    };


    const handleResetPassword = async () => {
        if (!newPassword) {
            message.error("Please enter a new password.");
            return;
        }
        if (newPassword.length < 8) {
            message.error("Password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match. Please check and try again.");
            return;
        }

        try {
            const messageKey = "resetPassword";
            message.loading({ content: "Resetting password...", key: messageKey });

            const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok && data.success) {
                message.success({ content: "Password reset successfully! Redirecting to login...", key: messageKey });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                message.error({ content: data.message || "Failed to reset password. Please try again.", key: messageKey });
            }
        } catch (error) {
            message.error({ content: "An error occurred while resetting password. Please try again later.", key: messageKey });
            console.error("Reset password error:", error);
        }
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-center mb-6">
                {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === num
                                ? "bg-blue-600 text-white"
                                : step > num
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {step > num ? "✓" : num}
                        </div>
                        {num < 3 && (
                            <div className={`w-10 h-1 ${step > num ? "bg-green-500" : "bg-gray-200"}`}></div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Email Verification";
            case 2:
                return "Enter OTP";
            case 3:
                return "New Password";
            default:
                return "Reset Password";
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-image-login">
            <Card className="w-96 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="text-center">
                    <div className="mb-6 mt-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getStepTitle()}</h2>
                        <p className="text-gray-600 text-sm mb-2">
                            {step === 1 && "Enter your email to receive a password reset code."}
                            {step === 2 && "Enter the 6-digit code sent to your email."}
                            {step === 3 && "Create a new secure password for your account."}
                        </p>
                    </div>

                    {renderStepIndicator()}

                    {step === 1 && (
                        <>
                            <InputField
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                            <Button
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                                onClick={handleSendOtp}
                                text="Send OTP"
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <InputField
                                type="text"
                                placeholder="Enter 6-digit verification code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                            <Button
                                className="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                                onClick={handleVerifyOtp}
                                text="Verify OTP"
                            />
                            <div className="text-sm text-gray-600 mb-2">
                                Didn't receive the code?{" "}
                                {resendDisabled ? (
                                    <span className="text-blue-500">Resend in {countdown}s</span>
                                ) : (
                                    <button
                                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                        onClick={handleResendOtp}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <InputField
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                            <InputField
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                            <Button
                                className="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                                onClick={handleResetPassword}
                                text="Reset Password"
                            />
                        </>
                    )}

                    <div className="mt-4 text-xs text-gray-500">
                        Remember your password?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Back to login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
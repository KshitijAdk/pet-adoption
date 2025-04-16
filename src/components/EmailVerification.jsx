import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./ui/InputField";
import Button from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import ToastComponent from "./ui/ToastComponent";
import './styles.css';

export default function EmailVerification() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);

    const handleChange = (index, value, event) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        } else if (event.key === "Backspace" && !value && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData("text").trim().replace(/\D/g, "");
        const newOtp = pastedData.split("").slice(0, 6);
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    };

    const handleSubmit = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length < 6) {
            toast.error("Please enter the complete OTP.");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/auth/verify-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp: enteredOtp }),
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Email Verified Successfully!");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleResend = async () => {
        setResendDisabled(true);
        setCountdown(30);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        toast.info("Resending OTP...");

        try {
            const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                toast.success("OTP Resent Successfully!");
            } else {
                toast.error(data.message || "Failed to resend OTP.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-image-login">
            <Card className="w-96 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="text-center">
                    <div className="mb-6 mt-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600 text-sm">
                            We've sent a 6-digit code to your email address.
                            Enter it below to verify your account.
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <InputField
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                className="h-12 w-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value, e)}
                                onKeyDown={(e) => handleChange(index, e.target.value, e)}
                            />
                        ))}
                    </div>

                    <Button
                        className="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                        onClick={handleSubmit}
                        text="Verify Email"
                    />

                    <div className="text-sm text-gray-600 mb-2">
                        Didn't receive the code?{' '}
                        {resendDisabled ? (
                            <span className="text-blue-500">Resend in {countdown}s</span>
                        ) : (
                            <button
                                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                onClick={handleResend}
                            >
                                Resend Code
                            </button>
                        )}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        Having trouble? Contact <span className="text-blue-600">support@example.com</span>
                    </div>
                </CardContent>
            </Card>
            <ToastComponent />
        </div>
    );
}
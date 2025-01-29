import { useState } from "react";
import InputField from "./ui/inputField";
import Button from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "react-toastify";
import './styles.css'

export default function EmailVerification() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendDisabled, setResendDisabled] = useState(false);

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

    const handleSubmit = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length < 6) {
            toast.error("Please enter the complete OTP.");
            return;
        }
        toast.success("OTP Verified Successfully!");
    };

    const handleResend = () => {
        setResendDisabled(true);
        toast.info("Resending OTP...");
        setTimeout(() => {
            toast.success("OTP Resent Successfully!");
            setResendDisabled(false);
        }, 30000);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-image-login">
            <Card className="w-96 p-6 shadow-lg ">
                <CardContent className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
                    <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to your email</p>
                    <div className="flex justify-center gap-4 mb-4">
                        {otp.map((digit, index) => (
                            <InputField
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                className="h-12 w-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value, e)}
                                onKeyDown={(e) => handleChange(index, e.target.value, e)}
                            />
                        ))}
                    </div>

                    <Button className="w-full mb-2" onClick={handleSubmit} text=" Verify OTP" />

                    <p className="text-sm text-gray-500">
                        Didn't receive an OTP?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={handleResend}
                            disabled={resendDisabled}
                        >
                            Resend OTP
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
import React, { useState } from "react";
import Navbar from "./Navbar";
import Button from "./ui/button";
import InputField from "./ui/inputField";
import "../components/styles.css";

const Signup = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordShown((prev) => !prev);

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-[#5F41E4] bg-image-login">
                <div className="w-full max-w-[410px] p-6 rounded-lg bg-white shadow-lg">
                    <h2 className="text-left text-[2rem] font-semibold mb-5 text-black">Sign Up</h2>
                    <p className="text-left text-lg font-medium text-gray-700 mb-6">
                        Create your account to get started
                    </p>
                    <form action="#" className="signup-form">
                        <InputField
                            id="fullName"
                            label="Full Name"
                            placeholder="Full Name"
                            required
                        />
                        <InputField
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Email address"
                            required
                        />
                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            isPasswordShown={isPasswordShown}
                            togglePasswordVisibility={togglePasswordVisibility}
                            required
                        />
                        <Button
                            text="Sign Up"
                            onClick={() => console.log("Sign Up clicked")}
                            variant="primary"
                            className="w-full"
                        />
                    </form>
                    <button
                        type="button"
                        className="w-full h-12 mt-4 text-white font-medium text-lg rounded-lg bg-[#DB4437] hover:bg-[#C1351D] transition ease-in-out flex items-center justify-center"
                    >
                        {/* Google Icon SVG */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 488 512"
                            className="h-5 w-5 mr-3"
                        >
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                        </svg>
                        Login with Google
                    </button>
                    <p className="text-center text-base font-medium mt-5 mb-1">
                        Already have an account?{" "}
                        <a href="/login" className="text-[#5F41E4] hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;

import { useState } from "react";
import Navbar from "./Navbar";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../components/styles.css";

const Signup = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

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
                        {/* First and Last Name Inputs with Labels */}
                        <div className="flex gap-4 mb-4">
                            <div className="relative w-1/2">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] placeholder-[#9284c8] transition ease-in-out"
                                />
                            </div>

                            <div className="relative w-1/2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] placeholder-[#9284c8] transition ease-in-out"
                                />
                            </div>
                        </div>

                        {/* Email Input with Label */}
                        <div className="relative mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] placeholder-[#9284c8] transition ease-in-out"
                            />
                        </div>

                        {/* Password Input with Label */}
                        <div className="relative mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Password"
                                className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] placeholder-[#9284c8] transition ease-in-out"
                            />
                            <span
                                onClick={() => setIsPasswordShown((prevState) => !prevState)}
                                className="absolute top-10 right-3 transform -translate-y-1/2 text-[#917DE8] cursor-pointer text-xl"
                            >
                                {isPasswordShown ? <EyeOff /> : <Eye />}
                            </span>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="w-full h-10 mt-5 text-white font-medium text-lg rounded-lg bg-[#5F41E4] hover:bg-[#4320df] transition ease-in-out"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Sign Up with Google Button */}
                    <button
                        type="button"
                        className="w-full h-10 mt-4 text-white font-medium text-lg rounded-lg bg-[#DB4437] hover:bg-[#C1351D] transition ease-in-out flex items-center justify-center"
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
                        Sign Up with Google
                    </button>

                    {/* Login Prompt */}
                    <p className="text-center text-base font-medium mt-5 mb-1">
                        Already have an account? <a href="/login" className="text-[#5F41E4] hover:underline">Login</a>
                    </p>
                </div>
            </div >
        </>
    );
};

export default Signup;

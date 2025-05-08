import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Mail, Lock } from "lucide-react";
import Button from "./ui/button";
import InputField from "./ui/InputField";
import { AppContent } from "../context/AppContext";
import Loading from "./ui/Loading";
import OAuth from "./OAuth";
import axios from "axios";
import { message } from 'antd'

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, setUserData } = useContext(AppContent);

  const togglePasswordVisibility = () => setIsPasswordShown((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      const { data } = response;

      if (data.success) {
        // Update context state
        setIsLoggedin(true);
        setUserData(data.user);

        // Optional: Store in localStorage if needed elsewhere
        localStorage.setItem("user", JSON.stringify(data.user));

        message.success("Login successful!");
        navigate("/");
        window.location.reload(); // Reload the page to reflect changes
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.status === 403
        ? `Account is banned: ${error.response?.data?.banReason || 'No reason provided'}`
        : error.response?.data?.message || "Login failed";
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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

            <InputField
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              iconPosition="left"
              isPasswordShown={isPasswordShown}
              togglePasswordVisibility={togglePasswordVisibility}
              className="h-12 rounded-xl"
              required
            />

            <div className="flex justify-end">
              <a
                href="/reset-password"
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              text={isLoading ? "Signing in..." : "Sign In"}
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 mt-4 h-12 shadow-sm"
              disabled={isLoading}
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

            <OAuth />

            {/* Signup Link */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {isLoading && <Loading text="Signing you in..." />}
    </div>
  );
};

export default Login;
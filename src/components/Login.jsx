import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Mail, Lock, Eye, EyeOff } from "lucide-react";
import InputField from "./ui/InputField";
import Button from "./ui/button";
import ToastComponent from "./ui/ToastComponent";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import Loading from "./ui/Loading";
import "../components/styles.css";

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const togglePasswordVisibility = () => setIsPasswordShown((prevState) => !prevState);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful! Redirecting...");
        setIsLoggedin(true);
        await getUserData();
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="flex items-center justify-end">
              <a
                href="/reset-password"
                className="text-xs text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              text={isLoading ? "Signing in..." : "Sign In"}
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
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {isLoading && <Loading text="Signing you in..." />}
      <ToastComponent />
    </div>
  );
};

export default Login;
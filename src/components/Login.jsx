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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300 p-4">
      <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-100 p-3 rounded-2xl">
            <PawPrint size={32} className="text-purple-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mt-2">
            Sign in to continue helping pets find their forever homes
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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

          <div className="flex items-center justify-end">
            <a
              href="/reset-password"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            text={isLoading ? "Signing in..." : "Sign In"}
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
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      {isLoading && <Loading text="Signing you in..." />}
      <ToastComponent />
    </div>
  );
};

export default Login;
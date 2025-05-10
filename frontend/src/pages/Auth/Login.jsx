import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Button";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import axios from 'axios'; // for raw csrf request

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  // Step 1: Login method and Step 2: Verify 2FA
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const fetchCsrfToken = async () => {
    try {
      const csrfResponse = await axios.get(`${apiUrl}/api/csrf-token`, {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.token;
      localStorage.setItem('CSRF_TOKEN', csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token for login', error);
      toast.error("CSRF protection failed. Please refresh the page.");
    }
  };

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    //store the token on the context state  so that it can be shared any where in our application by context provider
    setToken(token);

    navigate("/about-us");
  };

  //function for handle login with credentials
const onLoginHandler = async (data) => {
  try {
    setLoading(true);

    // 👇 Fetch CSRF token before login
    await fetchCsrfToken();

    const response = await api.post("/auth/public/signin", data);

    toast.success("Login Successful");
    reset();

    if (response.status === 200 && response.data.jwtToken) {
      setJwtToken(response.data.jwtToken);
      const decodedToken = jwtDecode(response.data.jwtToken);
      if (decodedToken.is2faEnabled) {
        setStep(2);
      } else {
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      }
    } else {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  } catch (error) {
    toast.error("Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  //function for verify 2fa authentication
  const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="bg-white sm:w-[440px] w-[340px] rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl mx-auto"
          >
            {/* Card header with gradient bg */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-4 pb-4 px-5 mb-3">
              <h1 className="font-montserrat text-center font-bold text-xl text-white mb-0.5">
                Welcome Back
              </h1>
              <p className="text-blue-100 text-center text-xs">
                Sign in to continue your learning journey
              </p>
            </div>
            
            <div className="px-5 pb-5">
              {/* Social login buttons */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <a
                  href={`${apiUrl}/oauth2/authorization/google`}
                  className="flex gap-1 items-center justify-center flex-1 border border-gray-200 p-1.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FcGoogle className="text-base" />
                  <span className="font-semibold sm:text-xs text-xs text-gray-700">
                    Google
                  </span>
                </a>
                <a
                  href={`${apiUrl}/oauth2/authorization/github`}
                  className="flex gap-1 items-center justify-center flex-1 border border-gray-200 p-1.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FaGithub className="text-base" />
                  <span className="font-semibold sm:text-xs text-xs text-gray-700">
                    GitHub
                  </span>
                </a>
              </div>
              
              {/* Divider */}
              <Divider className="font-medium text-gray-400 text-sm my-3">OR</Divider>
              
              {/* Form fields with minimal spacing */}
              <div className="space-y-2 mt-3">
                <div className="relative group">
                  <InputField
                    label="Username"
                    required
                    id="username"
                    type="text"
                    message="*Username is required"
                    placeholder="Enter your username"
                    register={register}
                    errors={errors}
                    className="transition-all duration-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-1.5 text-sm"
                  />
                </div>
                
                <div className="relative group">
                  <InputField
                    label="Password"
                    required
                    id="password"
                    type="password"
                    message="*Password is required"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    className="transition-all duration-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-1.5 text-sm"
                  />
                </div>
              </div>
              
              {/* Forgot password link */}
              <div className="flex justify-end mt-1">
                <Link
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  to="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              
              {/* Login button */}
              <div className="mt-4">
                <Buttons
                  disabled={loading}
                  onClickhandler={() => {}}
                  className={`w-full py-2 rounded-lg font-medium text-white shadow-md transition-all duration-300 
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                    }`}
                  type="text"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Buttons>
              </div>
              
              {/* Sign up link */}
              <p className="text-center text-gray-600 mt-3 text-xs">
                Don't have an account?{' '}
                <Link
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onVerify2FaHandler)}
            className="bg-white sm:w-[440px] w-[340px] rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl mx-auto"
          >
            {/* 2FA card header with gradient bg */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-4 pb-4 px-5 mb-3">
              <h1 className="font-montserrat text-center font-bold text-xl text-white mb-0.5">
                Two-Factor Authentication
              </h1>
              <p className="text-blue-100 text-center text-xs">
                Enter the verification code to continue
              </p>
            </div>
            
            <div className="px-5 pb-5">
              <div className="space-y-2 mt-3">
                <div className="relative group">
                  <InputField
                    label="Verification Code"
                    required
                    id="code"
                    type="text"
                    message="*Code is required"
                    placeholder="Enter your 2FA code"
                    register={register}
                    errors={errors}
                    className="transition-all duration-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-1.5 text-sm"
                  />
                </div>
              </div>
              
              {/* Verify button */}
              <div className="mt-4">
                <Buttons
                  disabled={loading}
                  onClickhandler={() => {}}
                  className={`w-full py-2 rounded-lg font-medium text-white shadow-md transition-all duration-300 
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                    }`}
                  type="text"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Buttons>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

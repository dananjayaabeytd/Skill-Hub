import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Button";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = {
      username,
      email,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);
      toast.success("Reagister Successful");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      // Add an error programmatically by using the setError function provided by react-hook-form
      //setError(keyword,message) => keyword means the name of the field where I want to show the error

      if (
        error?.response?.data?.message === "Error: Username is already taken!"
      ) {
        setError("username", { message: "username is already taken" });
      } else if (
        error?.response?.data?.message === "Error: Email is already in use!"
      ) {
        setError("email", { message: "Email is already in use" });
      }
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate to the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card container with animation - significantly reduced padding */}
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="bg-white sm:w-[440px] w-[340px] rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl mx-auto"
        >
          {/* Smaller card header with reduced padding */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-4 pb-4 px-5 mb-3">
            <h1 className="font-montserrat text-center font-bold text-xl text-white mb-0.5">
              Create Your Account
            </h1>
            <p className="text-blue-100 text-center text-xs">
              Join our community and start your learning journey
            </p>
          </div>
    
          <div className="px-5 pb-5">
            {/* More compact social buttons */}
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
    
            {/* Smaller divider with tighter margins */}
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
                  label="Email"
                  required
                  id="email"
                  type="email"
                  message="*Email is required"
                  placeholder="Enter your email address"
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
                  message="*Password must be at least 6 characters"
                  placeholder="Create a secure password"
                  register={register}
                  errors={errors}
                  min={6}
                  className="transition-all duration-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-1.5 text-sm"
                />
              </div>
            </div>
    
            {/* Compact button */}
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
                    Creating account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </Buttons>
            </div>
    
            {/* Tighter login link */}
            <p className="text-center text-gray-600 mt-3 text-xs">
              Already have an account?{' '}
              <Link
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
    
        {/* Minimal terms text */}
        <p className="text-xs text-center text-gray-500 mt-2 max-w-sm mx-auto">
          By signing up, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

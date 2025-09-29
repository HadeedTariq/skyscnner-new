import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FormInput from "./components/FormInput";
import useForm from "../../hooks/useForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const validate = (values: LoginFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values.email, values.password);
      navigate("/profile");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.log(error);
    }
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
  } = useForm<LoginFormValues>({
    initialValues,
    validate,
    onSubmit: handleSubmit,
  });

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white rounded-lg shadow-lg"
        whileHover={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </motion.div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            autoComplete="email"
          />

          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;

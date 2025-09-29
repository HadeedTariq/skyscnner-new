import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FormInput from "./components/FormInput";
import useForm from "../../hooks/useForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import InputSelect from "../Input-select";
/**
 * Interface for registration form values
 */
interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  gender: "male" | "female";
  confirmPassword: string;
}

/**
 * Registration form component
 */
const RegisterForm: React.FC = () => {
  const initialValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
    gender: "male",
    confirmPassword: "",
  };
  const { sendOtp, isLoading, error, setError } = useAuth();
  const navigate = useNavigate();

  const validate = (values: RegisterFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.username) {
      errors.firstName = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async ({
    username,
    email,
    password,
    gender,
  }: RegisterFormValues): Promise<void> => {
    try {
      const success = await sendOtp({ username, email, password, gender });

      if (success) {
        navigate("/otp-verify", {
          state: {
            fromRegistration: true,
            email,
          },
        });
        toast.success("OTP sent to your email");
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message || "Sonething went wrong");
    }
  };

  useEffect(() => {
    setError(null);
  }, []);
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
  } = useForm<RegisterFormValues>({
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
        className="p-6 bg-background nded-lg shadow-lg"
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
          <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
          <p className="text-gray-600 mt-2">Join us to start your journey</p>
        </motion.div>

        {error && (
          <motion.p
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <FormInput
            id="username"
            name="username"
            label="User Name"
            type="text"
            placeholder="johndoe"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            required
          />

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
            autoComplete="new-password"
          />

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
          <InputSelect
            label="Gender"
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
            ]}
            defaultValue="male"
          />

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;

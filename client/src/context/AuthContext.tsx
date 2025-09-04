import axios from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  gender: string;
}

interface OtpProps {
  email: string;
  username: string;
  password: string;
  gender: "male" | "female";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sendOtp: (otpProps: OtpProps) => Promise<boolean>;
  register: (email: string, otp: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/auth");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async ({ email, username, password, gender }: OtpProps) => {
    setError(null);
    setIsLoading(true);
    try {
      await axios.post("/auth/sendOtp", {
        email,
        username,
        password,
        gender,
      });
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, otp: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await axios.post("/auth/register", { email, otp });
      await checkAuth();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await axios.post("/auth/login", { email, password });
      await checkAuth();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post("/auth/logout");
      setUser(null);
    } catch {
      setError("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        sendOtp,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

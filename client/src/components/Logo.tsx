import React from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { Link } from "react-router";
interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <motion.div
      className={`${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
        <Link to={"/"} className={`text-2xl font-bold`}>
          <img src={logo} alt="logo" className="w-12 invert brightness-100" />
        </Link>
      </div>
    </motion.div>
  );
};

export default Logo;

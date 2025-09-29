import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Breadcrumb from "./Breadcrumb";

interface PagesHeaderProps {
  image: string;
  heading?: string;
  children?: React.ReactNode;
}

const PagesHeader = ({ image, heading, children }: PagesHeaderProps) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsInView(true);
  }, []);

  // Enhanced animations with professional timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic-bezier for smooth, professional motion
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const childrenVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.1, filter: "blur(8px)" },
    visible: {
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1.0], // Ease-out cubic for smooth image reveal
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <div className="py-12 bg-dark-blue"></div>
      <div className="relative h-[600px] max-[780px]:h-[780px] w-full  overflow-hidden shadow-xl">
        {/* Background Image with enhanced animation */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={imageVariants}
        />

        {/* Gradient Overlay with subtle animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 z-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={overlayVariants}
        />

        {/* Content Container with staggered children animations */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center h-full text-white  px-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {heading && (
            <motion.h1
              className="text-4xl font-bold mb-6 tracking-tigh max-[800px]:mt-20"
              variants={headingVariants}
            >
              {heading}
            </motion.h1>
          )}

          <motion.div variants={childrenVariants}>{children}</motion.div>
        </motion.div>
      </div>

      {/* Animate the breadcrumb entrance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <Breadcrumb className="mt-6 " />
      </motion.div>
    </>
  );
};

export default PagesHeader;

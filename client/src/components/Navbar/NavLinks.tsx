import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faHotel, faPlane } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const buttons = [
  {
    name: "Flights",
    icon: faPlane,
    path: "/flights",
  },
  {
    name: "Hotels",
    icon: faHotel,
    path: "/hotels",
  },
  {
    name: "Cars",
    icon: faCar,
    path: "/cars",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const NavLinks = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <nav className="maxScreen">
      <motion.ul
        className="flex gap-2 py-2 pb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {buttons.map(({ name, icon, path }, index) => (
          <motion.li key={index} variants={itemVariants}>
            <Link to={path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  className={cn(
                    "border rounded-4xl bg-transparent hover:bg-light-blue/50 hover:border-light-blue hover:text-white text-white transition-all duration-200",
                    isActive(path)
                      ? "bg-light-blue text-white border-light-blue"
                      : ""
                  )}
                  variant="ghost"
                >
                  <FontAwesomeIcon icon={icon} className="mr-2" />
                  {t(name.toLowerCase())}
                </Button>
              </motion.div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
};

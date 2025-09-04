import { translationFormatter } from "@/lib/utils";
import { CarIcon, Globe, LucideHotel } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface ServiceButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const ServiceButton = ({ icon, label, href }: ServiceButtonProps) => {
  return (
    <Link
      to={href}
      className="bg-dark-blue hover:bg-light-blue/75 
     text-md md:text-lg text-white cursor-pointer flex  gap-2 px-4 py-5 md:px-6 md:py-7 rounded-lg transition-colors duration-150 ease-in flex-col items justify-start text-start md:flex-row"
    >
      <span> {icon} </span>
      {label}
    </Link>
  );
};

const ServiceOptionBar = () => {
  const { t } = useTranslation();
  const services = [
    { icon: <LucideHotel />, label: "Hotels", href: "/hotels" },
    { icon: <CarIcon />, label: "Car hire", href: "/cars" },
    { icon: <Globe />, label: "Explore everywhere", href: "/flights" },
  ];

  return (
    <div className="maxScreen grid grid-cols-3 justify-center gap-4 flex-wrap mt-12">
      {services.map((service, index) => (
        <ServiceButton
          key={index}
          icon={service.icon}
          label={t(translationFormatter(service.label))}
          href={service.href}
        />
      ))}
    </div>
  );
};

export default ServiceOptionBar;

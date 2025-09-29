import React from "react";
import { ExternalLink, Plane } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

type FooterLink = {
  label: string;
  href: string;
  id?: string;
  external?: boolean;
  rel?: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

// Reusable Footer Link component
const FooterLink: React.FC<FooterLink> = ({
  label,
  href,
  id,
  external,
  rel,
}) => {
  return (
    <li>
      <Link
        to={href}
        id={id}
        rel={rel}
        target={external ? "_blank" : undefined}
        className="text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors duration-200 text-sm group"
      >
        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
          {label}
        </span>
        {external && <ExternalLink size={14} className="opacity-70" />}
      </Link>
    </li>
  );
};

// Reusable Footer Column component
const FooterColumn: React.FC<{ column: FooterColumn }> = ({ column }) => {
  return (
    <div className="flex flex-col space-y-3">
      <h3 className="font-semibold text-base text-white mb-1">
        {column.title}
      </h3>
      <ul className="space-y-2.5">
        {column.links.map((link) => (
          <FooterLink key={link.label} {...link} />
        ))}
      </ul>
    </div>
  );
};

// Footer Component with footer data
const Footer: React.FC = () => {
  const footerData: FooterColumn[] = [
    {
      title: "Travel Services",
      links: [
        {
          label: "Search Flights",
          href: "/flights",
          id: "flights-home",
        },
        {
          label: "Find Hotels",
          href: "/hotels",
          id: "hotels-cities",
        },
        {
          label: "Car Rentals",
          href: "/cars",
          id: "car-hire-home",
        },
      ],
    },
    {
      title: "Quick Links",
      links: [
        {
          label: "Hotel Deals",
          href: "/hotels",
          id: "hotels-home",
        },
        {
          label: "Flight Offers",
          href: "/flights",
        },
        {
          label: "Car Hire",
          href: "/cars",
        },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Plane className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EasyFlight
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            Your trusted partner for comparing and booking the best travel deals
            worldwide.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10">
          {footerData.map((column) => (
            <FooterColumn key={column.title} column={column} />
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} EasyFlight Ltd. All rights reserved.
          </p>
          <p className="text-gray-500 text-center sm:text-right">
            Compare and book with ease
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

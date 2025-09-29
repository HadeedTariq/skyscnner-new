import { useState, useEffect } from "react";
import { Plane, Car, Building2, Home, ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router";
import Logo from "@/components/Logo";

const PageNotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickLinks = [
    {
      icon: Home,
      title: "Home",
      description: "Back to homepage",
      href: "/",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Plane,
      title: "Flights",
      description: "Search flights",
      href: "/flights",
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: Building2,
      title: "Hotels",
      description: "Find hotels",
      href: "/hotels",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Car,
      title: "Cars",
      description: "Rent a car",
      href: "/cars",
      color: "from-green-500 to-emerald-600",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Logo />
            </div>
            <Link
              to={"/"}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Easy Flight
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/flights"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Flights
            </Link>
            <Link
              to="/hotels"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Hotels
            </Link>
            <Link
              to="/cars"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cars
            </Link>
            <Link
              to={"/login"}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 404 Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="text-[200px] md:text-[300px] font-bold text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-slate-700 dark:to-slate-600 bg-clip-text leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700">
                  <Compass
                    className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin"
                    style={{ animationDuration: "8s" }}
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Oops! Flight Not Found
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto">
              Looks like this page took an unexpected detour. Let's get you back
              on track!
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Don't worry, even the best pilots need to recalibrate sometimes.
              Explore our options below.
            </p>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {link.description}
                  </p>
                  <Link
                    to={link.href}
                    className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Go to {link.title}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default PageNotFound;

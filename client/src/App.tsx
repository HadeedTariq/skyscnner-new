import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/main";
import HotelPage from "./pages/hotels/main";
import FlightPage from "./pages/Flight/main";
import CarsPage from "./pages/cars/main";
import HotelInfoPage from "./pages/hotels/hotel-info-page";
import FlightResult from "./pages/Flight/flight-search";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register"; // Ensure this exists
import AuthLayout from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Profile from "./components/Profile";
import OtpVerification from "./components/auth/OtpVerification";
import OTPSuccess from "./components/auth/Otp-success";
import HotelSearchResult from "./pages/hotels/hotel-search-result";
import CarSearchResult from "./pages/cars/car-search-result";
import PaymentPage from "./pages/payment/PaymentPage";
import { useAirports } from "./store/airportStore";
import { useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardMain from "./pages/dashboard/DashboardMain";
import FlightSearch from "./pages/dashboard/FlightSearch";
import HotelSearch from "./pages/dashboard/HotelSearch";
import CarSearch from "./pages/dashboard/CarSearch";
import UserDetails from "./pages/dashboard/UserDetails";
import AdminAuth from "./pages/dashboard/AdminAuth";
const App = () => {
  const fetchAll = useAirports((state) => state.fetchAll);
  useEffect(() => {
    const fetchAirports = async () => {
      await fetchAll();
    };
    fetchAirports();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/otp-verify" element={<OtpVerification />} />
          <Route path="/otp-success" element={<OTPSuccess />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="flights" element={<FlightPage />} />
          <Route path="flights/search" element={<FlightResult />} />
          <Route path="hotels" element={<HotelPage />} />
          <Route path="hotels/search" element={<HotelSearchResult />} />
          <Route path="hotels/:hotelId" element={<HotelInfoPage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="cars/search" element={<CarSearchResult />} />
          <Route path="payments" element={<PaymentPage />} />
        </Route>
        <Route path="/admin-auth" element={<AdminAuth />} />

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardMain />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="flight-search" element={<FlightSearch />} />
          <Route path="hotel-search" element={<HotelSearch />} />
          <Route path="car-search" element={<CarSearch />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

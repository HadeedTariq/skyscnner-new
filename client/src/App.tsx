import { Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAirports } from "./store/airportStore";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

const HomePage = lazy(() => import("./pages/home/main"));
const HotelPage = lazy(() => import("./pages/hotels/main"));
const FlightPage = lazy(() => import("./pages/Flight/main"));
const CarsPage = lazy(() => import("./pages/cars/main"));
const HotelInfoPage = lazy(() => import("./pages/hotels/hotel-info-page"));
const FlightResult = lazy(() => import("./pages/Flight/flight-search"));
const HotelSearchResult = lazy(
  () => import("./pages/hotels/hotel-search-result")
);
const CarSearchResult = lazy(() => import("./pages/cars/car-search-result"));
const PaymentPage = lazy(() => import("./pages/payment/PaymentPage"));

const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const OtpVerification = lazy(() => import("./components/auth/OtpVerification"));
const OTPSuccess = lazy(() => import("./components/auth/Otp-success"));
const Profile = lazy(() => import("./components/Profile"));
const AdminAuth = lazy(() => import("./pages/dashboard/AdminAuth"));

const DashboardMain = lazy(() => import("./pages/dashboard/DashboardMain"));
const FlightSearch = lazy(() => import("./pages/dashboard/FlightSearch"));
const HotelSearch = lazy(() => import("./pages/dashboard/HotelSearch"));
const CarSearch = lazy(() => import("./pages/dashboard/CarSearch"));
const UserDetails = lazy(() => import("./pages/dashboard/UserDetails"));

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import LoadingBar from "./components/LoadingBar";

const App = () => {
  const fetchAll = useAirports((state) => state.fetchAll);

  useEffect(() => {
    const fetchAirports = async () => {
      await fetchAll();
    };
    fetchAirports();
  }, [fetchAll]);

  return (
    <Suspense fallback={<LoadingBar />}>
      <Routes>
        {/* Auth Routes */}
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

        {/* Main App Routes */}
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

        {/* Admin Auth */}
        <Route path="/admin-auth" element={<AdminAuth />} />

        {/* Dashboard Routes */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardMain />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="flight-search" element={<FlightSearch />} />
          <Route path="hotel-search" element={<HotelSearch />} />
          <Route path="car-search" element={<CarSearch />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;

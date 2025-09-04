import PagesHeader from "@/components/PagesHeader";
import ServiceOptionBar from "@/components/service-options/service-option-bar";
import HomeSearchForm from "@/pages/home/main/HomeSearchForm";
import FlightHero from "@/pages/home/main/Hero/Home-Hero";
import headerImg from "@/assets/images/Flights-hero.webp";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation("flight_search");
  return (
    <div>
      <PagesHeader image={headerImg} heading={t("form_title")}>
        <HomeSearchForm />
      </PagesHeader>
      <ServiceOptionBar />
      <FlightHero />
    </div>
  );
};

export default HomePage;

import PagesHeader from "@/components/PagesHeader";
import ServiceOptionBar from "@/components/service-options/service-option-bar";
import HomeSearchForm from "@/pages/home/main/HomeSearchForm";
import FlightHero from "@/pages/home/main/Hero/Home-Hero";
import headerImg from "@/assets/images/Flights-hero.webp";

const HomePage = () => {
  return (
    <div>
      <PagesHeader image={headerImg} heading={"Find Your Flight"}>
        <HomeSearchForm />
      </PagesHeader>
      <ServiceOptionBar />
      <FlightHero />
    </div>
  );
};

export default HomePage;

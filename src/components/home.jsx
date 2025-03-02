import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import StatsSection from "./StatsSection";
import FeaturedPets from "./FeaturedPets";
import AboutSection from "./AboutSection";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <>
      <div className="bg-image-main">

        <HeroSection />
        <StatsSection />
        <FeaturedPets />
        <AboutSection />
        <ServicesSection />
        <BlogSection />
        <CTASection />

      </div>
    </>
  );
};

export default Home;

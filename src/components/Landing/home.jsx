import { useState, useEffect } from "react";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import StatsSection from "./StatsSection";
import FeaturedPets from "./FeaturedPets";
import AboutSection from "./AboutSection";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="bg-image-main">
        {/* Hero doesn't need animation as it's at the top */}
        <HeroSection />

        <AnimateOnScroll animation="fadeInUp">
          <StatsSection />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeIn" duration={1.0}>
          <FeaturedPets />
        </AnimateOnScroll>

        <AnimateOnScroll animation="slideInLeft">
          <AboutSection />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp" delay={0.2}>
          <ServicesSection />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeIn">
          <BlogSection />
        </AnimateOnScroll>

        <AnimateOnScroll animation="scaleUp">
          <CTASection />
        </AnimateOnScroll>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showScrollTop ? 1 : 0,
            y: showScrollTop ? 0 : 20,
            pointerEvents: showScrollTop ? "auto" : "none",
          }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 bottom-6 bg-amber-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
          aria-label="Scroll to top"
        >
          <ArrowUp />
        </motion.button>
      </div>
    </>
  );
};

export default Home;
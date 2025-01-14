import Search from "./search";
import Navbar from "./Navbar"
import InfoSection from "./InfoSection";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="bg-image-main">

        <Navbar />
        <Search />
        <InfoSection />
        <ServicesSection />
        <BlogSection />
        <Footer />

      </div>
    </>
  );
};

export default Home;

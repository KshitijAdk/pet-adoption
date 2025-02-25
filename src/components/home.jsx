import Search from "./search";
import InfoSection from "./InfoSection";
import ServicesSection from "./ServicesSection";
import BlogSection from "./BlogSection";

const Home = () => {
  return (
    <>
      <div className="bg-image-main">

        <Search />
        <InfoSection />
        <ServicesSection />
        <BlogSection />

      </div>
    </>
  );
};

export default Home;

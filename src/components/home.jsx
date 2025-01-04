import Search from "./search";
import Navbar from "./Navbar"
// import "./style.css";
// import Steps from "./Home/Steps";
// import Services from "./Services";
// import Blogs from "./Blogs";

const Home = () => {
  return (
    <>
      <div className="bg-image-main">

        <Navbar />
        <Search />
        {/* <Steps/>
        <Services />
        <Blogs /> */}
      </div>
    </>
  );
};

export default Home;

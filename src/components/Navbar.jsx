import logo from "../assests/image.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="font-medium text-black bg-pink-100 bg-opacity-70 flex flex-wrap justify-evenly items-center p-2 backdrop-blur-lg sticky top-0 left-0 w-full z-50">
        <div className="rounded-full">
          <Link to={"/"}>
            <img
              src={logo}
              className="rounded-full"
              height="60px"
              width="60px"
              alt="sano sansar logo"
            />
          </Link>
        </div>

        <div className="text-black text-xs md:text-sm flex rounded-full px-5 py-3">
          <ul className="flex justify-center gap-10 font-bold">
            <li>
              <Link
                to="/"
                className="transform transition duration-500 hover:underline underline-offset-4"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pets"
                className="transform transition duration-500 hover:underline underline-offset-4"
              >
                Pets
              </Link>
            </li>
            <li>
              <Link
                to="/aboutUs"
                className="transform transition duration-500 hover:underline underline-offset-4"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/fullblogs"
                className="transform transition duration-500 hover:underline underline-offset-4"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="transform transition duration-500 hover:underline underline-offset-4"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center">
          <Link to="/login">
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
          Log In
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import PetTypeCard from "./petcard";
import petsImage from "../assests/pets.png";
import { DogIcon, Cat, PawPrintIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Search = () => {
  return (
    <>
      <div
        className="p-10 bg-center bg-cover bg-opacity-15"
        style={{
          backgroundImage: `url(${petsImage})`,
        }}
      >
        <h1 className="text-5xl mt-40 text-center text-white font-bold ">
          Take care of your Friend !
        </h1>
        <br />
        <p className="text-white text-center">
          If you want a bestfriend, you’re in the right place! Find the ideal
          pet for yours and adopt it, bring love into your life:)
        </p>
        <br />

        <div className="flex flex-wrap gap-5 items-center justify-center p-1 mt-10 h-auto text-white">
          <Link to="/pets">
            <PetTypeCard
              petType={"Cat"}
              petIcon={<DogIcon size={"50px"} className=" text-black" />}
            />
          </Link>
          <Link to="/pets">
            <PetTypeCard
              petType={"Dog"}
              petIcon={<Cat size={"50px"} className=" text-black" />}
            />
          </Link>
          <Link to="/pets">
            <PetTypeCard
              petType={"Other Pets"}
              petIcon={<PawPrintIcon size={"50px"} className=" text-black" />}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Search;

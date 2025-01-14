import React from "react";
import Button from "./ui/button";
import petImage from '../assests/home.png';
import './styles.css';

const Search = () => {
  return (
    <div className="relative bg-white text-black bg-image-login">
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Section */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Do you think about <br /> adopting a pet?
            </h1>
            <p className="text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button text="FIND OUT NOW" variant="primary" />
              <Button text="DONATE" variant="secondary" />
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src={petImage} alt="Dog" className="rounded-lg -mt-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

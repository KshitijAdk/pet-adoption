import React from "react";
import { Home, Dog, HelpCircle } from "lucide-react";
import Button from "./ui/button";

const InfoSection = () => {
  return (
    <div className="bg-white text-black py-16 bg-image-login">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">PLANNING TO ADOPT A PET?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center h-full">
            <Home size={48} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-600">
              CHECKLIST FOR NEW ADOPTERS
            </h3>
            <p className="text-gray-700 mt-2 flex-grow mb-6">
              Make the adoption transition as smooth as possible.
            </p>
            <Button text="LEARN MORE" variant="secondary" />
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center h-full">
            <Dog size={48} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-600">
              HOW OLD IS A DOG IN HUMAN YEARS?
            </h3>
            <p className="text-gray-700 mt-2 flex-grow mb-6">
              Learn to translate dog years to human years just for fun, and vice
              versa. Finally answer how old your dog is!
            </p>
            <Button text="LEARN MORE" variant="secondary" />
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center h-full">
            <HelpCircle size={48} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-purple-600">
              PET ADOPTION FAQs
            </h3>
            <p className="text-gray-700 mt-2 flex-grow mb-6">
              Get answers to all the questions you haven't thought of for your
              adoption.
            </p>
            <Button text="LEARN MORE" variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
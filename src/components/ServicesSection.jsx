import React from "react";
import { Stethoscope, PawPrint, Bone, Scissors } from "lucide-react";

const ServicesSection = () => {
  return (
    <div className="bg-purple-100 py-16 bg-image-testimonials">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-black-800 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-purple-200 rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-purple-300 p-4 rounded-full inline-block mb-4">
              <Stethoscope size={40} className="text-purple-800" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Vet</h3>
            <p className="text-purple-700">
              Our veterinary services offer comprehensive healthcare for your
              pets, including routine check-ups, vaccinations, and emergency
              care. Our experienced veterinarians are dedicated to ensuring the
              health and well-being of your furry friends, providing
              personalized treatment plans and compassionate care.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-purple-200 rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-purple-300 p-4 rounded-full inline-block mb-4">
              <PawPrint size={40} className="text-purple-800" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Walks</h3>
            <p className="text-purple-700">
              Our dog walking services provide regular exercise and
              socialization for your pets, ensuring they remain healthy and
              happy. Whether you need daily walks while you're at work or
              occasional outings, our professional dog walkers are here to help.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-purple-200 rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-purple-300 p-4 rounded-full inline-block mb-4">
              <Bone size={40} className="text-purple-800" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">
              Training
            </h3>
            <p className="text-purple-700">
              We offer professional pet training services to help your pets
              learn obedience, behavior modification, and advanced skills. Our
              certified trainers use positive reinforcement techniques to teach
              commands and address behavioral issues, ensuring your pet becomes
              a well-behaved member of your family.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-purple-200 rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-purple-300 p-4 rounded-full inline-block mb-4">
              <Scissors size={40} className="text-purple-800" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Salon</h3>
            <p className="text-purple-700">
              Our pet salon provides a range of grooming services, including
              baths, haircuts, nail trims, and ear cleaning. Our skilled
              groomers ensure your pets look and feel their best, using gentle
              and safe techniques to keep them clean and well-groomed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
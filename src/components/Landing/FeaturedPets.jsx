import { Clock, MapPin, ArrowRight } from "lucide-react";
import AnimateOnScroll, { AnimatedChild } from '../ui/AnimateOnScroll'

const petsData = [
  {
    name: "Max",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Max is a playful Golden Retriever who loves long walks and playing fetch.",
    age: "2 years old",
    location: "San Francisco",
    status: "Available",
  },
  {
    name: "Luna",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Luna is a sweet tabby cat who enjoys lounging in sunny spots and gentle pets.",
    age: "1 year old",
    location: "Los Angeles",
    status: "Available",
  },
  {
    name: "Bella",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Bella is a sweet tabby cat who enjoys lounging in sunny spots and gentle pets.",
    age: "1 year old",
    location: "Los Angeles",
    status: "Available",
  },
];

const FeaturedPets = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Adorable Pets</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These loving companions are waiting for their forever homes. Could you be their perfect match?
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll staggerChildren={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petsData.map((pet, index) => (
              <AnimatedChild key={index} animation="scaleUp">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={pet.image}
                      alt={`Pet named ${pet.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">{pet.status}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <Clock className="h-4 w-4 mr-1" /> {pet.age} •
                      <MapPin className="h-4 w-4 mx-1" /> {pet.location}
                    </div>
                    <p className="text-gray-600 mb-4">{pet.description}</p>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                      Meet {pet.name}
                    </button>
                  </div>
                </div>
              </AnimatedChild>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp" delay={0.3}>
          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold">
              View All Available Pets <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default FeaturedPets;
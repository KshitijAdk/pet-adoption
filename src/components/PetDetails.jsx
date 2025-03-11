import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ChevronLeft, CheckCircle } from 'lucide-react';

// Static pet data
const pet = {
  id: 1,
  name: "Max",
  type: "Dog",
  breed: "Golden Retriever",
  age: "2 years",
  location: "San Francisco, CA",
  image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  tags: ["Friendly", "Trained", "Good with kids"],
  description: "Max is a loving and energetic Golden Retriever who's looking for an active family. He's great with children and other dogs, and has completed basic obedience training. Max enjoys playing fetch, going for long walks, and cuddling on the couch.",
  details: {
    weight: "65 lbs",
    size: "Large",
    gender: "Male",
    spayedNeutered: true,
    houseTrained: true,
    health: "Vaccinated",
    goodWith: ["Children", "Dogs", "Cats"],
    traits: ["Playful", "Intelligent", "Affectionate", "Active"],
  },
  vendor: "Happy Paws Shelter"
};

const PetDetails = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <Link to="/pets" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Pets
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={pet.image} alt={pet.name} className="w-full h-[500px] object-cover" />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{pet.name}</h1>
                <p className="text-gray-600">{pet.breed} • {pet.age}</p>
              </div>
              <button className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-300">
                <Heart className="h-6 w-6 text-red-500" />
              </button>
            </div>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 mr-2" />
              {pet.location}
            </div>
            <p className="text-gray-600 text-right">Posted by : <br></br> <b>{pet.vendor}</b></p>
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About {pet.name}</h2>
              <p className="text-gray-600 leading-relaxed">{pet.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Weight</div>
                <div className="font-semibold">{pet.details.weight}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Gender</div>
                <div className="font-semibold">{pet.details.gender}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Health</div>
                <div className="font-semibold">{pet.details.health}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Size</div>
                <div className="font-semibold">{pet.details.size}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Good with</h3>
              <div className="flex flex-wrap gap-2">
                {pet.details.goodWith.map((item, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {pet.details.traits.map((trait, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/adoption-form">
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Adopt Now
                </button>
              </Link>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
                Ask About {pet.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
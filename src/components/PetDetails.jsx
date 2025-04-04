import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Heart, MapPin, ChevronLeft, CheckCircle } from "lucide-react";
import Loading from "./ui/Loading";
import AdoptionFormModal from "./AdoptionForm";
import { AppContent } from "../context/AppContext";

const PetDetails = () => {
  const { petId } = useParams();
  const navigate = useNavigate(); // Initialize navigate function
  const { isLoggedin } = useContext(AppContent);
  const [pet, setPet] = useState(null);
  const [vendorLocation, setVendorLocation] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pets/${petId}`);
        const result = await response.json();

        if (result.pet) {
          setPet(result.pet);
          setVendorLocation(result.vendorLocation);
          setVendorName(result.vendorName);
        } else {
          setError("Pet details not found");
        }
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setError("Error fetching pet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!pet) return <div>Pet details are not available.</div>;

  const handleAdoptNowClick = () => {
    if (!isLoggedin) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      setIsModalOpen(true); // Open the modal if logged in
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto px-6 py-8">
      <Link to="/pets" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Pets
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={pet.imageUrl} alt={pet.name} className="w-full h-[500px] object-cover" />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{pet.name}</h1>
                <p className="text-gray-600">{pet.breed} • {pet.age} years old</p>
              </div>
              <button className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-300">
                <Heart className="h-6 w-6 text-red-500" />
              </button>
            </div>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 mr-2" />
              {vendorLocation}
            </div>
            <p className="text-gray-600 text-right">Posted by : <br /> <b>{vendorName}</b></p>
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About {pet.name}</h2>
              <p className="text-gray-600 leading-relaxed">{pet.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Weight</div>
                <div className="font-semibold">{pet.weight} lbs</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Gender</div>
                <div className="font-semibold">{pet.gender}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Health</div>
                <div className="font-semibold">{pet.health}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 mb-1">Size</div>
                <div className="font-semibold">{pet.size}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Good with</h3>
              <div className="flex flex-wrap gap-2">
                {pet.goodWith.map((item, index) => (
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
                {pet.traits.map((trait, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            {pet.status === "Available" && (
              <div className="flex gap-4">
                <button
                  onClick={handleAdoptNowClick}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Adopt Now
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Ask About {pet.name}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AdoptionFormModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PetDetails;

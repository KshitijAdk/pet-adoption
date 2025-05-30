import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, ChevronLeft, CheckCircle, MessageCircle, Calendar } from "lucide-react";
import Loading from "./ui/Loading";
import AdoptionFormModal from "./AdoptionForm";
import { AppContent } from "../context/AppContext";
import FavouriteButton from "./ui/FavouriteButton";
import { message } from "antd";

const PetDetails = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { isLoggedin, userData, backendUrl } = useContext(AppContent);
  const [pet, setPet] = useState(null);
  const [vendorLocation, setVendorLocation] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorImage, setVendorImage] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/pets/petDetails/${petId}`);
        const result = await response.json();

        if (result.pet) {
          setPet(result.pet);
          setVendorLocation(result.vendorLocation);
          setVendorName(result.vendorName);
          setVendorId(result.vendorId);
          setVendorImage(result.vendorImage || "/api/placeholder/100/100");

          // Check if pet is in user's favorites
          if (userData?.favoritePets?.includes(result.pet._id)) {
            setIsFavorite(true);
          }
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

    console.log(userData);


    fetchPetDetails();
  }, [petId, userData?.favoritePets]);

  const getDaysAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const handleAdoptNowClick = () => {
    if (!isLoggedin) {
      navigate("/login");
    } else if (userData?.role !== "user") {
      message.error("Only users can adopt pets.");
    } else if (userData?.banInfo?.isBanned) {
      message.error("You are banned from adopting pets.");
    } else {
      setIsModalOpen(true);
    }
  };


  const handleCloseModal = () => setIsModalOpen(false);

  const navigateToVendorProfile = () => {
    navigate(`/vendor/${vendorId}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-4 text-center text-red-500">{error}</div>;
  if (!pet) return <div className="container mx-auto px-4 py-4 text-center">Pet details are not available.</div>;

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <Link to="/pets" className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-4 transition-colors duration-200 font-medium">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Pets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-[500px] object-cover"
            />
            <FavouriteButton petId={pet._id} isInitiallyFavorited={isFavorite} />
            <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${pet.status === "Available" ? "bg-green-500" : "bg-amber-500"
              } text-white`}>
              {pet.status}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-gray-500 text-sm">{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-3 w-3 mr-1 text-amber-500" />
            {vendorLocation}
          </div>

          <div
            className="flex items-center bg-gray-200 p-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={navigateToVendorProfile}
          >
            <div className="relative w-8 h-8 mr-3">
              <img
                src={vendorImage}
                alt={vendorName}
                className="rounded-full object-cover w-full h-full border-2 border-amber-200"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-2.5 h-2.5 border border-white"></div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Posted by</div>
              <div className="font-medium text-sm text-gray-800 hover:underline">{vendorName}</div>
            </div>
            <div className="ml-auto flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{getDaysAgo(pet.createdAt)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About {pet.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{pet.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs mb-0.5">Weight</div>
              <div className="font-semibold text-sm">{pet.weight} lbs</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs mb-0.5">Gender</div>
              <div className="font-semibold text-sm">{pet.gender}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs mb-0.5">Health</div>
              <div className="font-semibold text-sm">{pet.health}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs mb-0.5">Size</div>
              <div className="font-semibold text-sm">{pet.size}</div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Good with</h3>
            <div className="flex flex-wrap gap-1.5">
              {pet.goodWith.map((item, index) => (
                <span key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Traits</h3>
            <div className="flex flex-wrap gap-1.5">
              {pet.traits.map((trait, index) => (
                <span key={index} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {pet.status === "Available" && (
            <div className="flex gap-2">
              <button
                onClick={handleAdoptNowClick}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-300 text-sm"
              >
                Adopt Now
              </button>
            </div>
          )}
        </div>
      </div>

      <AdoptionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        petId={petId}
        vendorId={vendorId}
      />
    </div>
  );
};

export default PetDetails;
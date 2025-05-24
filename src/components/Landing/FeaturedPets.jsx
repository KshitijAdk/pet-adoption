import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import AnimateOnScroll, { AnimatedChild } from '../ui/AnimateOnScroll';
import { usePets } from "../../context/PetContext";
import PetCard from "../ui/petcard";

const FeaturedPets = () => {
  const { pets } = usePets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Safety check for pets data
  if (!pets) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-500">Loading pets...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(pets)) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-500">Error: Invalid pets data format</p>
          </div>
        </div>
      </section>
    );
  }

  // Filter available pets
  const availablePets = pets.filter(pet => {
    if (!pet) return false;
    const status = pet.status || pet.Status || pet.availability || pet.Availability;
    return !status || status.toLowerCase() === "available";
  });

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, availablePets.length - itemsPerPage);

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [availablePets.length, maxIndex, currentIndex]);

  // Get current pets to display
  const getCurrentPets = () => {
    if (availablePets.length === 0) return [];
    const safeIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    return availablePets.slice(safeIndex, safeIndex + itemsPerPage);
  };

  const nextSlide = () => {
    if (availablePets.length <= itemsPerPage || isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (availablePets.length <= itemsPerPage || isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleMeetClick = (petId) => {
    if (petId) navigate(`/pets/${petId}`);
  };

  const currentPets = getCurrentPets();
  const showNavigation = availablePets.length > itemsPerPage;

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

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                aria-label="Previous pets"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                aria-label="Next pets"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Pet Cards Grid */}
          <div className="overflow-hidden">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ease-in-out ${isTransitioning ? 'transform scale-95 opacity-90' : 'transform scale-100 opacity-100'
                }`}
              style={{ minHeight: '400px' }}
            >
              {currentPets.length > 0 ? (
                currentPets.map((pet, index) => {
                  if (!pet) return null;
                  const petId = pet._id || pet.id;

                  return (
                    <div
                      key={petId || `pet-${index}`}
                      className="w-full h-full flex flex-col transition-all duration-300 ease-in-out"
                      style={{
                        transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                        opacity: isTransitioning ? 0.8 : 1
                      }}
                    >
                      <PetCard pet={pet} onMeetClick={handleMeetClick} />
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    {pets.length === 0
                      ? "No pets found in context"
                      : availablePets.length === 0
                        ? `Found ${pets.length} pets but none are available`
                        : "No pets to display"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination Dots */}
          {showNavigation && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 300);
                    }
                  }}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to position ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <AnimateOnScroll animation="fadeInUp" delay={0.3}>
          <div className="text-center mt-10">
            <a
              href="/pets"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold"
              onClick={(e) => {
                e.preventDefault();
                navigate('/pets');
              }}
            >
              View All Available Pets <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default FeaturedPets;
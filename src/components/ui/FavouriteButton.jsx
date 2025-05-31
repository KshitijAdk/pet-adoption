import { useContext, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { AppContent } from "../../context/AppContext";
import { message } from "antd";

const FavouriteButton = ({ petId }) => {
    const [isFavourited, setIsFavourited] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const { userData, backendUrl } = useContext(AppContent);

    useEffect(() => {
        const checkIfFavourited = async () => {
            if (!userData?.userId) {
                setIsLoading(false);
                return;
            }

            try {
                const favouritePets = userData.favouritePets || [];
                console.log("Favorite Pets:", favouritePets);

                if (favouritePets.includes(petId)) {
                    setIsFavourited(true); // ✅ correct: setting boolean
                } else {
                    setIsFavourited(false); // explicitly set to false
                }
            } catch (error) {
                console.error("Error checking favorites:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkIfFavourited();
    }, [userData, petId]);

    const toggleFavourite = async () => {
        if (!userData?.userId) {
            message.warning("Please login to add to favorites");
            return;
        }

        try {
            setIsAnimating(true);
            const isAdding = !isFavourited;
            setIsFavourited(isAdding);

            const endpoint = isAdding
                ? `${backendUrl}/api/pets/add-to-favourite`
                : `${backendUrl}/api/pets/remove-from-favourite`;

            const payload = {
                userId: userData.userId,
                petId
            };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsFavourited(!isAdding);
                if (response.status === 400) {
                    message.warning(data.message);
                } else if (response.status === 404) {
                    message.error(data.message);
                } else {
                    message.error("Something went wrong. Please try again.");
                }
            } else {
                if (isAdding) {
                    message.success("Pet added to favorites!");
                } else {
                    message.success("Pet removed from favorites");
                }
            }

            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        } catch (error) {
            const action = !isFavourited ? "adding to" : "removing from";
            console.error(`Error ${action} favourites:`, error);
            message.error(`Error ${action} favourites. Please try again.`);
            setIsFavourited(!isFavourited);
            setIsAnimating(false);
        }
    };

    const buttonClasses = `
        absolute top-2 right-2 
        bg-white p-2 rounded-full shadow-md 
        hover:shadow-lg hover:scale-110
        transition-all duration-300 ease-in-out
        ${isFavourited ? "text-red-500" : "text-gray-400"}
        ${isAnimating && isFavourited ? "animate-heart-beat" : ""}
        ${isAnimating && !isFavourited ? "animate-heart-break" : ""}
        focus:outline-none focus:ring-2 focus:ring-pink-300
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
    `;

    return (
        <>
            <style jsx>{`
                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                
                @keyframes heartBreak {
                    0% { transform: scale(1); }
                    20% { transform: scale(0.8); }
                    35% { transform: rotate(-5deg) scale(0.8); }
                    50% { transform: rotate(5deg) scale(0.8); }
                    65% { transform: rotate(-5deg) scale(0.8); }
                    80% { transform: scale(0.8); }
                    100% { transform: scale(1); }
                }
                
                .animate-heart-beat {
                    animation: heartBeat 0.8s ease-in-out;
                }
                
                .animate-heart-break {
                    animation: heartBreak 0.8s ease-in-out;
                }
            `}</style>

            <button
                onClick={toggleFavourite}
                className={buttonClasses}
                aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
                title={isFavourited ? "Remove from favourites" : "Add to favourites"}
                disabled={isLoading}
            >
                <Heart
                    fill={isFavourited ? "currentColor" : "none"}
                    strokeWidth={isFavourited ? 2.5 : 2}
                    size={24}
                    className="transition-all duration-300"
                />
            </button>
        </>
    );
};

export default FavouriteButton;
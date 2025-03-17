import { useContext, useState } from "react";
import { Heart } from "lucide-react";
import { AppContent } from "../../context/AppContext";

const FavoriteButton = ({ petId }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const { userData } = useContext(AppContent);

    const toggleFavorite = async () => {
        try {
            // Optimistic UI update
            setIsFavorited((prev) => !prev);

            // Make API call to toggle favorite
            const response = await fetch("http://localhost:3000/api/pets/toggle-favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userData?.userId, petId }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Revert optimistic update if API call fails
                setIsFavorited((prev) => !prev);
                console.error("Error:", data.message);
                alert("Something went wrong. Please try again.");
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("Error toggling favorite.");
            // Revert optimistic update if an error occurs
            setIsFavorited((prev) => !prev);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition ${isFavorited ? "text-red-500" : "text-gray-600"
                }`}
        >
            <Heart fill={isFavorited ? "currentColor" : "none"} />
        </button>
    );
};

export default FavoriteButton;

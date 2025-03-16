// components/ui/FavoriteButton.jsx
import { useState } from "react";
import { Heart } from "lucide-react";

const FavoriteButton = ({ petId }) => {
    const [isFavorited, setIsFavorited] = useState(false);

    const toggleFavorite = () => {
        setIsFavorited((prev) => !prev);
        console.log(`Pet ${petId} ${!isFavorited ? "added to" : "removed from"} favorites.`);
        // Optionally, make API call here to save favorite status
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

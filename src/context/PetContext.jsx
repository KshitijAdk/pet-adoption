// src/context/PetContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPetById = async (petId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`http://localhost:3000/api/pets/${petId}`);
            return response.data; // return pet data to the caller
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch pet details");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <PetContext.Provider value={{ fetchPetById, loading, error }}>
            {children}
        </PetContext.Provider>
    );
};

// Custom hook to access context
export const usePet = () => useContext(PetContext);

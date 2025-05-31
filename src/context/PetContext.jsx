import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppContent } from './AppContext';


const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { backendUrl } = useContext(AppContent);


    const fetchAllPets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/pets/pets-with-vendor`);
            const data = await res.json();

            if (res.ok) {
                setPets(data.pets || []);
            } else {
                setError(data.message || 'Failed to fetch pets');
            }
        } catch (err) {
            setError('Something went wrong');
            console.error('Error fetching pets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPets();
    }, []);

    return (
        <PetContext.Provider value={{ pets, loading, error, refreshPets: fetchAllPets }}>
            {children}
        </PetContext.Provider>
    );
};

// Custom hook for using context
export const usePets = () => useContext(PetContext);

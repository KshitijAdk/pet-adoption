import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import Tabs from '../Admin/Tabs';
import PetForm from './PetForm';
import PetList from './PetList';
import { AppContent } from '../context/AppContext';
import Loading from '../components/ui/Loading';

const PetManagement = () => {
    const { userData, loading: userLoading } = useContext(AppContent); // Rename loading to userLoading
    const [pets, setPets] = useState([]);
    const [isAddingPet, setIsAddingPet] = useState(false);
    const [editingPetId, setEditingPetId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: 0,
        gender: 'Male',
        description: '',
        imageUrl: '',
        status: 'Available',
    });
    const [loading, setLoading] = useState(true); // Add a loading state

    const tabs = [
        { id: 'all', label: 'All Pets', link: '/pets/all' },
        { id: 'available', label: 'Available', link: '/pets/available' },
        { id: 'pending', label: 'Adoption Requests', link: '/pets/pending' },
        { id: 'adopted', label: 'Adopted', link: '/pets/adopted' },
    ];

    useEffect(() => {
        if (userLoading || !userData || !userData.vendorDetails) {
            return; // Don't fetch pets until user data is loaded
        }

        const fetchPets = async () => {
            const vendorId = userData.vendorDetails.vendorId;

            if (!vendorId) {
                console.error('Vendor ID not found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/pets/${vendorId}/pets`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data.pets); // Set the fetched pets
                } else {
                    console.error('Failed to fetch pets');
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchPets();
    }, [userData, userLoading]);

    if (loading) {
        return <Loading />; // Use the Loading component here
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) || 0 : value,
        });
    };


    const handleAddPet = async (e) => {
        e.preventDefault();

        console.log('Form Data before submission:', formData); // Debugging

        const vendorId = userData.vendorDetails?.vendorId; // Get vendorId

        if (!vendorId) {
            console.error('Vendor ID not found');
            return;
        }

        if (!formData.imageUrl) {
            console.error('Image URL is required');
            return;
        }

        const newPet = {
            name: formData.name,
            species: formData.species,
            breed: formData.breed,
            age: formData.age,
            gender: formData.gender,
            size: formData.size, // Make sure 'size' is included here
            description: formData.description,
            image: formData.imageUrl, // Ensure this is sent
            status: formData.status,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/pets/add/${vendorId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                const addedPet = await response.json();
                console.log("Full backend response:", addedPet); // Log the full response

                // Update the pets state with the new pet
                setPets((prevPets) => {
                    if (!addedPet || !addedPet.pet || !addedPet.pet._id) {
                        console.error("Invalid pet data received:", addedPet);
                        return prevPets; // Prevent updating state with undefined values
                    }

                    const updatedPets = [...prevPets, addedPet.pet];
                    console.log("Updated Pets after adding:", updatedPets); // Debugging
                    return updatedPets;
                });


                setIsAddingPet(false);
                setFormData({
                    name: '',
                    species: '',
                    breed: '',
                    age: 0,
                    gender: 'Male',
                    size: '',  // Ensure the size is reset here
                    description: '',
                    imageUrl: '',
                    status: 'Available',
                });
            } else {
                console.error('Failed to add pet:', await response.json());
            }
        } catch (error) {
            console.error('Error adding pet:', error);
        }
    };

    const handleEditPet = (pet) => {
        setFormData(pet);
        setEditingPetId(pet.id);
    };

    const handleUpdatePet = async (e) => {
        e.preventDefault();
        console.log("Update clicked");
        // Add your update logic here if necessary
    };

    const handleCancelEdit = () => {
        setEditingPetId(null);
        setIsAddingPet(false);
        setFormData({
            name: '',
            species: '',
            breed: '',
            age: 0,
            gender: 'Male',
            size: '',
            description: '',
            imageUrl: '',
            status: 'Available',
        });
    };

    const handleDeletePet = (petId) => {
        // After deleting a pet
        setPets((prevPets) => {
            const updatedPets = prevPets.filter((pet) => pet._id !== petId);
            console.log("Updated Pets after deleting:", updatedPets); // Debugging
            return updatedPets;
        });
    };

    const handleTabChange = (tabId) => {
        setFilter(tabId);
    };

    const filteredPets =
        filter === 'all' ? pets : pets.filter((pet) => pet.status.toLowerCase() === filter);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                <Tabs tabs={tabs} initialActiveTab={filter} onTabChange={handleTabChange} />
            </div>

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Pet Listings</h1>
                <button
                    onClick={() => setIsAddingPet(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    Add New Pet
                </button>
            </div>

            {(isAddingPet || editingPetId) && (
                <PetForm
                    formData={formData}
                    setFormData={setFormData} // Ensure this is passed
                    handleInputChange={handleInputChange}
                    handleSubmit={editingPetId ? handleUpdatePet : handleAddPet}
                    editingPetId={editingPetId}
                    handleCancel={handleCancelEdit}
                    isOpen={isAddingPet || editingPetId}
                />
            )}


            {/* Render PetList or empty state */}
            {pets.length > 0 ? (
                <PetList
                    pets={pets}
                    handleEditPet={handleEditPet}
                    handleDeletePet={handleDeletePet}
                />
            ) : (
                <div className="text-center text-gray-500">No pets found. Add a new pet to get started.</div>
            )}
        </div>
    );
};

export default PetManagement;

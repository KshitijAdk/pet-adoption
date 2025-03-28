import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle, Home, PawPrint, ListChecks } from 'lucide-react';
import PetForm from './PetForm';
import PetList from './PetList';
import { AppContent } from '../context/AppContext';
import Loading from '../components/ui/Loading';
import Sidebar from '../components/ui/Sidebar'; // Import Sidebar component

const PetManagement = () => {
    const { userData, loading: userLoading } = useContext(AppContent);
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
        size: '',
        weight: 0,
        health: '',
        goodWith: [],
        traits: [],
        description: '',
        imageUrl: '',
        status: 'Available',
    });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Manage Sidebar open state

    const vendorMenuItems = [
        { path: "/vendor-dashboard", label: "Dashboard", icon: Home },
        { path: "/pets-listing", label: "Manage Pets", icon: PawPrint },
        { path: "/vendor/adoption-requests", label: "Adoption Requests", icon: ListChecks }
    ];


    // Fetch pets based on vendor ID
    useEffect(() => {
        if (userLoading || !userData?.vendorDetails) return;

        const fetchPets = async () => {
            const vendorId = userData.vendorDetails.vendorId;

            try {
                const response = await fetch(`http://localhost:3000/api/pets/${vendorId}/pets`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data.pets);
                } else {
                    console.error('Failed to fetch pets');
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [userData, userLoading]);

    if (loading) return <Loading />;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: checked
                    ? [...(prevFormData[name] || []), value]
                    : prevFormData[name].filter((item) => item !== value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value,
            }));
        }
    };

    // Add New Pet
    const handleAddPet = async (e) => {
        e.preventDefault();

        const vendorId = userData.vendorDetails?.vendorId;

        if (!vendorId || !formData.imageUrl) {
            console.error('Vendor ID or Image URL is missing');
            return;
        }

        const newPet = {
            ...formData,
            image: formData.imageUrl, // Send image as 'image'
        };

        try {
            const response = await fetch(`http://localhost:3000/api/pets/add/${vendorId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            });

            const result = await response.json();

            if (response.ok && result.pet) {
                setPets((prev) => [...prev, result.pet]);
                handleCancelEdit(); // Reset and close form
            } else {
                console.error('Failed to add pet:', result);
            }
        } catch (error) {
            console.error('Error adding pet:', error);
        }
    };

    // Edit Pet
    const handleEditPet = (pet) => {
        setFormData({
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age,
            gender: pet.gender,
            size: pet.size,
            weight: pet.weight,
            health: pet.health,
            goodWith: pet.goodWith || [],
            traits: pet.traits || [],
            description: pet.description,
            imageUrl: pet.image,
            status: pet.status,
        });
        setEditingPetId(pet._id);
        setIsAddingPet(true); // Open form for editing
    };

    // Update Pet
    const handleUpdatePet = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/pets/update/${editingPetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, image: formData.imageUrl }),
            });

            const result = await response.json();

            if (response.ok && result.pet) {
                setPets((prevPets) =>
                    prevPets.map((pet) => (pet._id === editingPetId ? result.pet : pet))
                );
                handleCancelEdit(); // Reset and close form
            } else {
                console.error('Failed to update pet:', result);
            }
        } catch (error) {
            console.error('Error updating pet:', error);
        }
    };

    // Cancel Add/Edit
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
            weight: 0,
            health: '',
            goodWith: [],
            traits: [],
            description: '',
            imageUrl: '',
            status: 'Available',
        });
    };

    // Delete Pet
    const handleDeletePet = async (petId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/pets/delete/${petId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
            } else {
                console.error('Failed to delete pet');
            }
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    const filteredPets = filter === 'all' ? pets : pets.filter((pet) => pet.status.toLowerCase() === filter);

    return (
        <div className="flex h-screen">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={vendorMenuItems}
                title="Vendor Panel"
            />

            <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-8' : 'ml-8'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Pet Listings</h1>
                    <button
                        onClick={() => setIsAddingPet(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                        Add New Pet
                    </button>
                </div>

                {(isAddingPet || editingPetId) && (
                    <PetForm
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        handleSubmit={editingPetId ? handleUpdatePet : handleAddPet}
                        editingPetId={editingPetId}
                        handleCancel={handleCancelEdit}
                        isOpen={isAddingPet || !!editingPetId}
                    />
                )}

                {filteredPets.length > 0 ? (
                    <PetList pets={filteredPets} handleEditPet={handleEditPet} handleDeletePet={handleDeletePet} />
                ) : (
                    <div className="text-center text-gray-500">No pets found. Add a new pet to get started.</div>
                )}
            </div>
        </div>
    );
};

export default PetManagement;

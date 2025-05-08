import React, { useState, useEffect, useContext } from 'react';
import { PlusCircle, Home, PawPrint, ListChecks } from 'lucide-react';
import { message } from 'antd';
import PetForm from './PetForm';
import PetList from './PetList';
import { AppContent } from '../context/AppContext';
import Loading from '../components/ui/Loading';
import Sidebar from '../components/ui/Sidebar';

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
        health: 'Vaccinated',
        goodWith: [],
        traits: [],
        description: '',
        imageUrl: '',
        status: 'Available',
    });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const vendorMenuItems = [
        { path: "/vendor-dashboard", label: "Dashboard", icon: Home },
        { path: "/pets-listing", label: "Manage Pets", icon: PawPrint },
        { path: "/vendor/adoption-requests", label: "Adoption Requests", icon: ListChecks }
    ];

    useEffect(() => {
        if (userLoading || !userData?.vendorDetails) return;

        const fetchPets = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pets/getPets?vendorId=${userData.vendorDetails.vendorId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data.pets);
                    message.success('Pets loaded successfully');
                } else {
                    const errorData = await response.json();
                    message.error(errorData.message || 'Failed to fetch pets');
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
                message.error('Error fetching pets. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [userData, userLoading]);

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

    const handleAddPet = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/pets/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    vendorId: userData.vendorDetails.vendorId,
                    imageUrl: formData.imageUrl || ''
                }),
            });

            const result = await response.json();

            if (response.ok && result.pet) {
                setPets((prev) => [...prev, result.pet]);
                message.success('Pet added successfully!');
                handleCancelEdit();
            } else {
                message.error(result.message || 'Failed to add pet');
            }
        } catch (error) {
            console.error('Error adding pet:', error);
            message.error('Error adding pet. Please try again.');
        }
    };

    const handleEditPet = (pet) => {
        setFormData({
            ...pet,
            imageUrl: pet.imageUrl,
            goodWith: pet.goodWith || [],
            traits: pet.traits || []
        });
        setEditingPetId(pet._id);
        setIsAddingPet(true);
    };

    const handleUpdatePet = async (e) => {
        e.preventDefault();

        console.log('Updating pet with ID:', editingPetId);
        console.log('Form data being sent:', formData);

        try {
            const response = await fetch(`/api/pets/${editingPetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            console.log('Response from server:', result);

            if (response.ok && result.pet) {
                setPets((prevPets) =>
                    prevPets.map((pet) => (pet._id === editingPetId ? result.pet : pet))
                );
                message.success('Pet updated successfully!');
                handleCancelEdit();
            } else {
                message.error(result.message || 'Failed to update pet');
            }
        } catch (error) {
            console.error('Error updating pet:', error);
            message.error('Error updating pet. Please try again.');
        }
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
            weight: 0,
            health: 'Vaccinated',
            goodWith: [],
            traits: [],
            description: '',
            imageUrl: '',
            status: 'Available',
        });
    };

    const handleDeletePet = async (petId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/pets/${petId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
                message.success('Pet deleted successfully!');
            } else {
                const result = await response.json();
                message.error(result.message || 'Failed to delete pet');
            }
        } catch (error) {
            console.error('Error deleting pet:', error);
            message.error('Error deleting pet. Please try again.');
        }
    };

    const filteredPets = filter === 'all'
        ? pets
        : pets.filter((pet) => pet.status.toLowerCase() === filter.toLowerCase());

    if (loading) return <Loading />;

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
                    <div className="flex gap-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded-md px-3 py-2"
                        >
                            <option value="all">All Pets</option>
                            <option value="available">Available</option>
                            <option value="adopted">Adopted</option>
                        </select>
                        <button
                            onClick={() => setIsAddingPet(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                            Add New Pet
                        </button>
                    </div>
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
                    <PetList
                        pets={filteredPets}
                        onEdit={handleEditPet}
                        onDelete={handleDeletePet}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-lg">No pets found.</p>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="text-indigo-600 hover:underline mt-2"
                            >
                                Show all pets
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetManagement;
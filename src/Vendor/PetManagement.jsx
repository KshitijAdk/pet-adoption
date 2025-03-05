import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Tabs from '../Admin/Tabs';
import PetForm from './PetForm';
import PetList from './PetList';

const PetManagement = () => {
    const [pets, setPets] = useState([
        {
            id: '1',
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 3,
            gender: 'Male',
            description: 'Friendly and loves to play fetch.',
            imageUrl: 'https://example.com/buddy.jpg',
            status: 'Available',
        },
        {
            id: '2',
            name: 'Mittens',
            species: 'Cat',
            breed: 'Siamese',
            age: 2,
            gender: 'Female',
            description: 'Loves to cuddle and nap in the sun.',
            imageUrl: 'https://example.com/mittens.jpg',
            status: 'Pending',
        },
    ]);

    const [isAddingPet, setIsAddingPet] = useState(false);
    const [editingPetId, setEditingPetId] = useState(null);
    const [filter, setFilter] = useState('all'); // State for filtering pets
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

    // Define tabs for the Tabs component
    const tabs = [
        { id: 'all', label: 'All Pets', link: '/pets/all' },
        { id: 'available', label: 'Available', link: '/pets/available' },
        { id: 'pending', label: 'Adoption Requests', link: '/pets/pending' },
        { id: 'adopted', label: 'Adopted', link: '/pets/adopted' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) || 0 : value,
        });
    };

    const handleAddPet = (e) => {
        e.preventDefault();
        const newPet = { ...formData, id: String(pets.length + 1) };
        setPets([...pets, newPet]);
        setFormData({
            name: '',
            species: '',
            breed: '',
            age: 0,
            gender: 'Male',
            description: '',
            imageUrl: '',
            status: 'Available',
        });
        setIsAddingPet(false);
    };

    const handleEditPet = (pet) => {
        setFormData(pet);
        setEditingPetId(pet.id);
    };

    const handleUpdatePet = (e) => {
        e.preventDefault();
        if (editingPetId) {
            const updatedPets = pets.map((pet) =>
                pet.id === editingPetId ? { ...pet, ...formData } : pet
            );
            setPets(updatedPets);
            setEditingPetId(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingPetId(null);
        setFormData({
            name: '',
            species: '',
            breed: '',
            age: 0,
            gender: 'Male',
            description: '',
            imageUrl: '',
            status: 'Available',
        });
        setIsAddingPet(false);
    };

    const handleDeletePet = (id) => {
        setPets(pets.filter((pet) => pet.id !== id));
    };

    // Handle tab changes
    const handleTabChange = (tabId) => {
        setFilter(tabId);
    };

    // Filter pets based on the selected tab
    const filteredPets =
        filter === 'all'
            ? pets
            : pets.filter((pet) => pet.status.toLowerCase() === filter);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Tabs Component with Design */}
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                <Tabs
                    tabs={tabs}
                    initialActiveTab={filter}
                    onTabChange={handleTabChange} // Pass the tab change handler
                />
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

            {/* Add/Edit Pet Form as Modal */}
            {(isAddingPet || editingPetId) && (
                <PetForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={editingPetId ? handleUpdatePet : handleAddPet}
                    editingPetId={editingPetId}
                    handleCancel={editingPetId ? handleCancelEdit : () => setIsAddingPet(false)}
                    isOpen={isAddingPet || editingPetId} // Pass isOpen prop to PetForm for modal visibility
                />
            )}

            {/* Pet List */}
            <PetList
                pets={filteredPets}
                handleEditPet={handleEditPet}
                handleDeletePet={handleDeletePet}
            />
        </div>
    );
};

export default PetManagement;

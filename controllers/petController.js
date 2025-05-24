import Pet from "../models/pet.model.js";
import userModel from "../models/userModel.js";
import Vendor from "../models/Vendor.js";
import mongoose from "mongoose";
import AdoptionRequest from '../models/adoptionRequest.model.js';
import { sendWhatsAppMessage } from '../utils/sendWhatsappMsg.js'

// controllers/petController.js
export const addPetToVendor = async (req, res) => {
    try {
        const { vendorId, imageUrl, ...rest } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const newPet = new Pet({
            ...rest,
            vendorId: vendor._id,
            imageUrl: req.file?.path || imageUrl || ''
        });

        const savedPet = await newPet.save();

        res.status(201).json({
            message: 'Pet added successfully',
            pet: savedPet
        });

    } catch (error) {
        console.error("Error adding pet:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


// Get all pets for a vendor
export const getPetsByVendor = async (req, res) => {
    const { vendorId } = req.query;
    console.log(vendorId);

    try {
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        const pets = await Pet.find({ vendorId }).sort({ createdAt: -1 });

        res.status(200).json({ pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a pet
export const deletePet = async (req, res) => {
    try {
        const { petId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pet ID format"
            });
        }

        const deletedPet = await Pet.findByIdAndDelete(petId);

        if (!deletedPet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found"
            });
        }

        // Also delete any adoption requests for this pet
        await AdoptionRequest.deleteMany({ petId });

        return res.status(200).json({
            success: true,
            message: "Pet deleted successfully",
            deletedPet
        });

    } catch (error) {
        console.error("Error deleting pet:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



export const updatePetById = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate if the pet exists
        const existingPet = await Pet.findById(id);
        if (!existingPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Validate vendor ID if needed (optional)
        // if (req.user.vendorId !== existingPet.vendorId.toString()) {
        //     return res.status(403).json({ message: 'Unauthorized to update this pet' });
        // }

        // Prepare updated fields
        const updateFields = {
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
            size: req.body.size,
            age: Number(req.body.age),
            gender: req.body.gender,
            weight: Number(req.body.weight),
            health: req.body.health,
            goodWith: req.body.goodWith || [],
            traits: req.body.traits || [],
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            status: req.body.status,
        };

        // Update the pet document
        const updatedPet = await Pet.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

        return res.status(200).json({ pet: updatedPet });
    } catch (error) {
        console.error('Error updating pet:', error);
        return res.status(500).json({ message: 'Server error while updating pet' });
    }
};


// Get pet details
export const getPetData = async (req, res) => {
    try {
        const { petId } = req.params;

        // Check if petId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({ message: "Invalid petId format" });
        }

        const pet = await Pet.findById(petId).populate('vendorId');


        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({
            pet,
            vendorId: pet.vendorId._id,
            vendorName: pet.vendorId.organization,
            vendorLocation: pet.vendorId.address,
            vendorImage: pet.vendorId.image,
        });
    } catch (error) {
        console.error("Error fetching pet data:", error);
        res.status(500).json({ message: "Internal server error while fetching pet data" });
    }
};



export const getAllPetsWithVendor = async (req, res) => {
    try {
        // Step 1: Get pets that are Available and not locked, and populate vendor info
        const pets = await Pet.find({
            status: 'Available',
            isLocked: false
        })
            .sort({ createdAt: -1 })
            .populate({
                path: 'vendorId',
                select: 'organization image address user', // include vendor's user reference
            });

        // Step 2: Filter out pets whose vendor's user is banned
        const filteredPets = [];

        for (const pet of pets) {
            const vendor = pet.vendorId;
            if (!vendor || !vendor.user) continue;

            const user = await userModel.findById(vendor.user).select('banInfo.isBanned');

            if (user && !user.banInfo?.isBanned) {
                filteredPets.push(pet);
            }
        }

        res.status(200).json({ pets: filteredPets });
    } catch (error) {
        console.error('Error fetching available, unlocked, unbanned pets:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const addToFavourite = async (req, res) => {
    const { userId, petId } = req.body;

    try {
        const user = await userModel.findById(userId);
        const pet = await Pet.findById(petId);

        if (!user || !pet) {
            return res.status(404).json({ message: "User or Pet not found" });
        }

        if (user.favouritePets.includes(petId)) {
            return res.status(400).json({ message: "Pet already in favourites" });
        }

        user.favouritePets.push(petId);
        await user.save();

        res.status(200).json({ message: "Pet added to favourites", favouritePets: user.favouritePets });
    } catch (error) {
        console.error("Error adding to favourites:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeFromFavourite = async (req, res) => {
    const { userId, petId } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.favouritePets.includes(petId)) {
            return res.status(400).json({ message: "Pet is not in favourites" });
        }

        user.favouritePets = user.favouritePets.filter(id => id.toString() !== petId);
        await user.save();

        res.status(200).json({ message: "Pet removed from favourites", favouritePets: user.favouritePets });
    } catch (error) {
        console.error("Error removing from favourites:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getFavouritePets = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId)
            .populate({
                path: "favouritePets",
                populate: {
                    path: "vendorId",
                    select: "organization image contact"
                }
            })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            favouritePets: user.favouritePets,
            count: user.favouritePets.length,
        })
    } catch (error) {
        console.error("Error fetching favourite pets", error)
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find({})
            .populate({
                path: "vendorId",
                select: "fullName organization email contact address description image"
            });
        res.status(200).json({
            success: true,
            count: pets.length,
            data: pets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


export const lockPet = async (req, res) => {
    const { petId, feedback } = req.body;

    console.log(`Locking pet with ID: ${petId} and feedback: ${feedback}`);

    // Validate petId
    if (!petId) {
        res.status(400);
        throw new Error('Pet ID is required');
    }

    // Find the pet
    const pet = await Pet.findById(petId);

    if (!pet) {
        res.status(404);
        throw new Error('Pet not found');
    }

    // Check if pet is already locked
    if (pet.isLocked) {
        res.status(400);
        throw new Error('Pet is already locked');
    }

    // Fetch the vendor using the vendorId from the pet
    const vendor = await Vendor.findById(pet.vendorId); // assuming `vendorId` is the field name

    if (!vendor) {
        res.status(404);
        throw new Error('Vendor not found');
    }

    // Send whatsApp message to vendor with pet name and feedback
    const message = `Pet ${pet.name} has been locked. Lock reason: ${feedback}`;
    try {
        await sendWhatsAppMessage(vendor.contact, message);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send WhatsApp message to vendor',
            error: error.message
        });
        return;
    }

    // Update pet to locked and save feedback as lock reason
    pet.isLocked = true;
    pet.lockReason = feedback;
    await pet.save();

    res.status(200).json({
        success: true,
        message: 'Pet locked successfully',
        data: {
            pet,
            vendorContact: vendor.contact || 'Contact not available'
        }
    });
};


export const unlockPet = async (req, res) => {
    const { petId } = req.body;

    // Validate petId
    if (!petId) {
        res.status(400);
        throw new Error('Pet ID is required');
    }

    // Find the pet
    const pet = await Pet.findById(petId);

    if (!pet) {
        res.status(404);
        throw new Error('Pet not found');
    }

    // Check if pet is already unlocked
    if (!pet.isLocked) {
        res.status(400);
        throw new Error('Pet is already unlocked');
    }

    // Update pet to unlocked
    pet.isLocked = false;
    await pet.save();

    res.status(200).json({
        success: true,
        message: 'Pet unlocked successfully',
        data: pet,
    });
};

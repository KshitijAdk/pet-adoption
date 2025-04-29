import Pet from "../models/pet.model.js";
import userModel from "../models/userModel.js";
import Vendor from "../models/Vendor.js";
import mongoose from "mongoose";

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
        const pets = await Pet.find({ status: 'Available' }) // only available pets
            .sort({ createdAt: -1 }) // latest first
            .populate({
                path: 'vendorId',
                select: 'organization image address' // only get these fields from vendor
            });

        res.status(200).json({ pets });
    } catch (error) {
        console.error('Error fetching available pets with vendor info:', error);
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
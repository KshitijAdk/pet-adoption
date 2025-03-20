import Vendor from "../models/Vendor.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const submitAdoptionRequest = async (req, res) => {
    console.log("Request Body:", req.body);  // Log the incoming request body

    try {
        const {
            adoptionId,
            petId,
            applicantId,
            fullName,
            email,
            phone,
            address,
            reasonForAdoption,
        } = req.body;

        // Validate incoming data
        if (!adoptionId || !petId || !applicantId || !fullName || !email || !phone || !address || !reasonForAdoption) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by applicantId
        const user = await userModel.findById(applicantId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the vendor who owns the pet
        const vendor = await Vendor.findOne({ "pets._id": petId });
        if (!vendor) {
            return res.status(404).json({ message: "Pet not found under any vendor" });
        }

        // Find the specific pet from the vendor's pets array
        const pet = vendor.pets.id(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found under this vendor" });
        }

        // Create the adoption request object
        const adoptionRequest = {
            adoptionId,
            applicantId,
            applicantName: fullName,
            applicantEmail: email,
            applicantContact: phone,
            applicantAddress: address,
            petId: pet._id,
            petName: pet.name,
            adoptionReason: reasonForAdoption,
            status: "Pending",
            createdAt: new Date(),
        };

        // Push the adoption request to the pet's adoptionRequests array
        pet.adoptionRequests.push(adoptionRequest);

        // Save the pet ID to the user's adoptedPets field
        if (!user.adoptedPets) {
            user.adoptedPets = [];
        }
        user.adoptedPets.push(pet._id);

        // Save the updated user and vendor documents
        await user.save();
        await vendor.save();

        // Return the created adoption request for confirmation
        res.status(201).json({
            message: "Adoption request submitted successfully",
            adoptionRequest,
        });
    } catch (error) {
        console.error("Error submitting adoption request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const approveAdoptionRequest = async (req, res) => {
    const { adoptionId, applicantId, petId } = req.body;

    try {
        console.log("🔹 Received Approve Request:", { adoptionId, applicantId, petId });

        // Convert petId and adoptionId to ObjectId for accurate queries
        const petObjectId = new mongoose.Types.ObjectId(petId);

        // 1️⃣ Find the user who made the adoption request
        const user = await userModel.findById(applicantId);
        if (!user) {
            return res.status(404).json({ message: `User with ID ${applicantId} not found` });
        }
        console.log("✅ User Found:", user._id);

        // 2️⃣ Find the vendor that owns the pet
        const vendor = await Vendor.findOne({ 'pets._id': petObjectId });
        if (!vendor) {
            return res.status(404).json({ message: `Pet with ID ${petId} not found in vendor records` });
        }
        console.log("✅ Vendor Found:", vendor._id);

        // 3️⃣ Find the pet inside the vendor's pets array
        const pet = vendor.pets.find((p) => p._id.equals(petObjectId));
        if (!pet) {
            return res.status(404).json({ message: `Pet with ID ${petId} not found in vendor records` });
        }
        console.log("✅ Pet Found:", pet.name);

        // 4️⃣ Find the adoption request in the pet's adoptionRequests array
        const adoptionRequest = pet.adoptionRequests.find((req) => req._id.toString() === adoptionId);
        if (!adoptionRequest) {
            return res.status(404).json({ message: `Adoption request with ID ${adoptionId} not found` });
        }
        console.log("✅ Adoption Request Found:", adoptionRequest);

        // 5️⃣ Update adoption request status and pet status
        if (adoptionRequest.status !== 'Approved') {
            adoptionRequest.status = "Approved";
            pet.status = "Adopted";
            await vendor.save();
            console.log("✅ Adoption Request Approved & Pet Status Updated");
        } else {
            console.log("⚠️ Adoption Request was already approved.");
        }

        // 6️⃣ Add pet to user's adoptedPets array (if not already added)
        if (!user.adoptedPets.includes(petId)) {
            user.adoptedPets.push(petId);
            await user.save();
            console.log("✅ User's Adopted Pets Updated");
        } else {
            console.log("⚠️ Pet was already added to user's adoptedPets.");
        }

        // ✅ Send success response
        res.status(200).json({ message: "Adoption request approved successfully" });

    } catch (error) {
        console.error("❌ Error in approveAdoptionRequest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Reject Adoption Request
export const rejectAdoptionRequest = async (req, res) => {
    const { adoptionId, petId } = req.body; // Expecting adoptionId and petId in the request body

    try {
        // Find the vendor that owns the pet
        const vendor = await Vendor.findOne({ 'pets._id': petId });
        if (!vendor) {
            return res.status(404).json({ message: 'Pet not found in vendor records' });
        }

        // Find the pet inside the vendor's pets array
        const pet = vendor.pets.find((pet) => pet._id.toString() === petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Find the adoption request in the pet's adoptionRequests array and update its status to 'Rejected'
        const adoptionRequest = pet.adoptionRequests.id(adoptionId);
        if (!adoptionRequest) {
            return res.status(404).json({ message: 'Adoption request not found' });
        }

        // Update the adoption request status to 'Rejected'
        adoptionRequest.status = 'Rejected';
        await vendor.save();

        // Send a success response
        res.status(200).json({ message: 'Adoption request rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Fetch adopted pets by userId
export const getAdoptedPets = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and populate adopted pets
        const user = await userModel.findById(userId).populate('adoptedPets');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ adoptedPets: user.adoptedPets });
    } catch (error) {
        console.error("Error fetching adopted pets:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
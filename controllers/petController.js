import Vendor from "../models/Vendor.js";

// Example backend route to handle pet addition
export const addPetToVendor = async (req, res) => {
    try {
        // Debug log to check request body
        const vendor = await Vendor.findById(req.params.vendorId);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Add the pet to the vendor's pets array
        vendor.pets.push(req.body);
        await vendor.save();

        res.status(201).json({ message: 'Pet added successfully' });
    } catch (error) {
        console.error("Error adding pet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Fetch all pets of a specific vendor by vendorId
export const getPetsByVendor = async (req, res) => {
    const { vendorId } = req.query; // Extract vendorId from the query params

    try {
        // Find the vendor by vendorId and select the pets array
        const vendor = await Vendor.findById(vendorId).select('pets');

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Return the pets associated with the vendor
        res.status(200).json({ pets: vendor.pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Delete Pet from Vendor's Pet List
export const deletePet = async (req, res) => {
    try {
        const { vendorId, petId } = req.body;

        // Check if both IDs are provided
        if (!vendorId || !petId) {
            return res.status(400).json({ success: false, message: "Vendor ID and Pet ID are required." });
        }

        // Find the vendor by vendorId
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found." });
        }

        // Find the pet in the vendor's pets array
        const petIndex = vendor.pets.findIndex(pet => pet._id.toString() === petId);
        if (petIndex === -1) {
            return res.status(404).json({ success: false, message: "Pet not found under this vendor." });
        }

        // Remove the pet from the array
        vendor.pets.splice(petIndex, 1);

        // Save the updated vendor document
        await vendor.save();

        return res.status(200).json({ success: true, message: "Pet deleted successfully." });

    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};


// Controller to fetch pet details by petId
export const getPetData = async (req, res) => {
    try {
        const { petId } = req.params;

        // Find the vendor containing the pet with the specified petId
        const vendor = await Vendor.findOne({ "pets._id": petId });

        if (!vendor) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Find the specific pet within the vendor's pets array
        const pet = vendor.pets.id(petId);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({ pet });
    } catch (error) {
        console.error("Error fetching pet data:", error);
        res.status(500).json({ message: "Server error" });
    }
};
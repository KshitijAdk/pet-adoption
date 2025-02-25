// controllers/vendorController.js
import Vendor from '../models/venderModal.js';

export const registerVendor = async (req, res) => {
    try {
        const { fullName, organization, email, contact, address, description, image } = req.body;

        // Ensure the image URL is available from the request body
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Create a new vendor object and save it to the database
        const newVendor = new Vendor({
            fullName,
            organization,
            email,
            contact,
            address,
            description,
            image, // Directly store the Cloudinary image URL
        });

        // Save the vendor to the database
        await newVendor.save();

        // Send success response
        res.status(201).json({ message: 'Vendor registered successfully!', vendor: newVendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong, please try again.' });
    }
};


// New controller to get all vendors
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find(); // Fetch all vendors from the database
        res.status(200).json({ vendors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vendors, please try again.' });
    }
};
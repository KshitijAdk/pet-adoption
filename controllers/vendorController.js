// controllers/vendorController.js
import Vendor from '../models/venderModal.js';
import userModel from '../models/userModel.js';

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

export const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find vendor application
        const vendorApplication = await Vendor.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        // Update user role
        const updatedUser = await userModel.findOneAndUpdate(
            { email: vendorApplication.email },
            {
                $set: {
                    role: "vendor",
                    organization: vendorApplication.organization,
                    contact: vendorApplication.contact,
                    address: vendorApplication.address,
                    description: vendorApplication.description,
                    image: vendorApplication.image
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Approve vendor
        await Vendor.findByIdAndUpdate(vendorId, { status: "approved" });

        res.status(200).json({ message: "Vendor approved successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
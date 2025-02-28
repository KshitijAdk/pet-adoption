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
        await Vendor.findByIdAndUpdate(vendorId, { status: "Approved" });

        res.status(200).json({ message: "Vendor approved successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find the vendor application
        const vendorApplication = await Vendor.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        // Update the user's role back to "user"
        const updatedUser = await userModel.findOneAndUpdate(
            { email: vendorApplication.email },
            {
                $set: {
                    role: "user",
                    organization: "",
                    contact: "",
                    address: "",
                    description: "",
                    image: ""
                }
            }, // Revert role to "user"
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the vendor application status to "rejected"
        vendorApplication.status = "Rejected";
        await vendorApplication.save();

        res.status(200).json({ message: "Vendor rejected successfully!", user: updatedUser, vendor: vendorApplication });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// New controller to get only pending vendors
export const getPendingVendors = async (req, res) => {
    try {
        // Assuming 'status' is a field in your Vendor model that tracks the vendor's approval status.
        const pendingVendors = await Vendor.find({ status: 'Pending' }); // Fetch all vendors with status 'pending'
        
        if (pendingVendors.length === 0) {
            return res.status(404).json({ message: 'No pending vendors found.' });
        }

        res.status(200).json({ vendors: pendingVendors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch pending vendors, please try again.' });
    }
};

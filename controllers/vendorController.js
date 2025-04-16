import VendorApplication from '../models/venderApplication.js';
import userModel from '../models/userModel.js';
import Vendor from '../models/Vendor.js';
import Pet from '../models/pet.model.js';

export const registerVendor = async (req, res) => {
    try {
        const { fullName, organization, email, contact, address, description } = req.body;

        // Check if vendor with this email already exists
        const existingVendor = await VendorApplication.findOne({ email });
        if (existingVendor) {
            return res.status(409).json({
                message: "Application with this email already exists"
            });
        }

        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({
                message: "Organization image is required"
            });
        }

        if (!req.files.idDocuments || req.files.idDocuments.length === 0) {
            return res.status(400).json({
                message: "At least one identity document is required"
            });
        }

        const image = req.files.image[0].path;
        const idDocumentUrls = req.files.idDocuments.map(file => file.path);

        const newVendor = new VendorApplication({
            fullName,
            organization,
            email,
            contact,
            address,
            description,
            image,
            idDocuments: idDocumentUrls
        });

        await newVendor.save();

        res.status(201).json({
            message: 'Vendor registered successfully!',
            vendor: newVendor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong, please try again.'
        });
    }
};

export const getAllVendorApplications = async (req, res) => {
    try {
        const vendors = await VendorApplication.find({});
        res.status(200).json({ success: true, data: vendors });
    } catch (error) {
        console.error("Error fetching vendor applications:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find vendor application
        const vendorApplication = await VendorApplication.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        // Update user role only
        const updatedUser = await userModel.findOneAndUpdate(
            { email: vendorApplication.email },
            {
                $set: {
                    role: "vendor",
                    image: vendorApplication.image,
                    address: vendorApplication.address,
                    contact: vendorApplication.contact,
                    description: vendorApplication.description,
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new vendor (no need for pets array now as they're separate)
        const newVendor = new Vendor({
            fullName: vendorApplication.fullName,
            organization: vendorApplication.organization,
            email: vendorApplication.email,
            contact: vendorApplication.contact,
            address: vendorApplication.address,
            description: vendorApplication.description,
            image: vendorApplication.image,
            // No need for pets or adoptionRequests arrays as they're separate collections
        });

        await newVendor.save();

        // Approve vendor application
        await VendorApplication.findByIdAndUpdate(vendorId, { status: "Approved" });

        res.status(200).json({
            message: "Vendor approved successfully!",
            user: updatedUser,
            vendor: newVendor
        });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find the vendor application
        const vendorApplication = await VendorApplication.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        // Remove vendor data from the Vendor schema
        await Vendor.findOneAndDelete({ email: vendorApplication.email });

        // Update the user's role back to "user"
        const updatedUser = await userModel.findOneAndUpdate(
            { email: vendorApplication.email },
            { $set: { role: "user" } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the vendor application status to "rejected"
        vendorApplication.status = "Rejected";
        await vendorApplication.save();

        res.status(200).json({
            message: "Vendor rejected successfully!",
            user: updatedUser,
            vendor: vendorApplication
        });
    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPendingVendors = async (req, res) => {
    try {
        const pendingVendors = await VendorApplication.find({ status: 'Pending' });
        res.status(200).json({ vendors: pendingVendors || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch pending vendors, please try again.' });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        // Fetch all vendors
        const vendors = await Vendor.find().lean();

        const vendorsWithPetData = await Promise.all(
            vendors.map(async vendor => {
                // Count of only available pets
                const availablePetsCount = await Pet.countDocuments({
                    vendorId: vendor._id,
                    status: 'Available'
                });

                // Fetch all pet details (not just imageUrl)
                const allPets = await Pet.find({
                    vendorId: vendor._id
                }).lean();

                return {
                    ...vendor,
                    availablePetsCount,
                    pets: allPets
                };
            })
        );

        res.status(200).json({
            success: true,
            data: vendorsWithPetData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vendors",
            error: error.message
        });
    }
};


export const getVendorById = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find vendor by ID
        const vendor = await Vendor.findById(vendorId).lean();

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Count available pets
        const availablePetsCount = await Pet.countDocuments({
            vendorId: vendor._id,
            status: 'Available'
        });

        // Fetch all pet details
        const allPets = await Pet.find({ vendorId: vendor._id }).lean();

        res.status(200).json({
            success: true,
            data: {
                ...vendor,
                availablePetsCount,
                pets: allPets
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor details',
            error: error.message
        });
    }
};

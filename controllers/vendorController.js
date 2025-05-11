import Vendor from '../models/Vendor.js';
import Pet from '../models/pet.model.js';
import VendorApplication from '../models/venderApplication.js';
import User from '../models/userModel.js';

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

        if (!req.files.fonepayQr || req.files.fonepayQr.length === 0) {
            return res.status(400).json({
                message: "Fonepay QR code is required"
            });
        }

        if (!req.files.idDocuments || req.files.idDocuments.length === 0) {
            return res.status(400).json({
                message: "At least one identity document is required"
            });
        }

        const image = req.files.image[0].path;
        const fonepayQr = req.files.fonepayQr[0].path;
        const idDocumentUrls = req.files.idDocuments.map(file => file.path);

        const newVendor = new VendorApplication({
            fullName,
            organization,
            email,
            contact,
            address,
            description,
            image,
            fonepayQr,
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

        // 1. Find and validate vendor application
        const vendorApplication = await VendorApplication.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        if (vendorApplication.status === "Approved") {
            return res.status(400).json({ message: "Application already approved" });
        }

        // 2. Find the user associated with the application
        const user = await User.findOne({ email: vendorApplication.email });
        if (!user) {
            return res.status(404).json({ message: "User not found for this application" });
        }

        // 3. Create vendor profile
        const newVendor = new Vendor({
            user: user._id, // ✅ Add the required user reference
            fullName: vendorApplication.fullName,
            organization: vendorApplication.organization,
            email: vendorApplication.email,
            contact: vendorApplication.contact,
            address: vendorApplication.address,
            description: vendorApplication.description,
            image: vendorApplication.image,
            fonepayQr: vendorApplication.fonepayQr,
            idDocuments: vendorApplication.idDocuments,
            application: vendorApplication._id,
            approvedAt: new Date(),
        });

        await newVendor.save();

        // 4. Update user role to "vendor" and add vendor reference
        user.role = "vendor";
        user.vendorId = newVendor._id;
        user.image = vendorApplication.image;
        user.address = vendorApplication.address;
        user.contact = vendorApplication.contact;
        user.description = vendorApplication.description;
        await user.save();

        // 5. Update application status
        vendorApplication.status = "Approved";
        vendorApplication.approvedVendor = newVendor._id;
        vendorApplication.processedAt = new Date();
        await vendorApplication.save();

        res.status(200).json({
            success: true,
            message: "Vendor approved successfully!",
            user,
            vendor: newVendor,
            application: vendorApplication,
        });

    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { rejectionReason } = req.body; // Optional: Add rejection reason

        // 1. Find vendor application
        const vendorApplication = await VendorApplication.findById(vendorId);
        if (!vendorApplication) {
            return res.status(404).json({ message: "Vendor application not found" });
        }

        if (vendorApplication.status === "Rejected") {
            return res.status(400).json({ message: "Application already rejected" });
        }

        // 2. If previously approved, remove vendor profile
        if (vendorApplication.approvedVendor) {
            await Vendor.findByIdAndDelete(vendorApplication.approvedVendor);
        }

        // 3. Reset user role to "user" (if they were a vendor)
        const updatedUser = await User.findOneAndUpdate(
            { email: vendorApplication.email },
            { $set: { role: "user" } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 4. Update application status (retain documents for audit)
        vendorApplication.status = "Rejected";
        vendorApplication.rejectionReason = rejectionReason || null;
        vendorApplication.processedAt = new Date();
        await vendorApplication.save();

        res.status(200).json({
            success: true,
            message: "Vendor rejected successfully!",
            user: updatedUser,
            application: vendorApplication,
        });

    } catch (error) {
        console.error("Error rejecting vendor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
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


import userModel from "../models/userModel.js";
import Vendor from "../models/Vendor.js";
import bcrypt from 'bcryptjs';
import sendEmail from "../utils/emailTemplates.js";
import VendorApplication from "../models/venderApplication.js";
import Pet from "../models/pet.model.js";
import AdoptionRequest from "../models/adoptionRequest.model.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsappMsg.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        // Ensure userId is provided
        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        // Find user by the provided userId
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Initialize user data object
        const userData = {
            userId: user._id,
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
            role: user.role,
            image: user.image,
            contact: user.contact,
            address: user.address,
            description: user.description,
            adoptedPets: user.adoptedPets,
            favouritePets: user.favouritePets,
            applications: user.applications,
            banInfo: user.banInfo,
        };

        // If the user is a vendor, fetch additional data from the Vendor collection
        if (user.role === 'vendor') {
            const vendorData = await Vendor.findOne({ email: user.email });

            if (vendorData) {
                userData.vendorDetails = {
                    vendorId: vendorData._id,
                    organization: vendorData.organization,
                    contact: vendorData.contact,
                    address: vendorData.address,
                    description: vendorData.description,
                    pets: vendorData.pets, // Include pets data
                    adoptionRequests: vendorData.adoptionRequests, // Include adoption requests data
                };
            }
        }

        // Return the user data
        res.json({
            success: true,
            userData,
        });

    } catch (error) {
        // Return the error message in the response
        res.json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: { $ne: 'admin' } }) // Only fetch users where role is not 'admin'
            .select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt')
            .populate('banInfo.bannedBy', 'name email')
            .lean();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        let adoptionRequestsDeleted = 0;

        // Delete VendorApplication if exists
        const vendorApplication = await VendorApplication.findOne({ user: userId });
        if (vendorApplication) {
            await vendorApplication.deleteOne();
        }

        // Check if the user is a vendor
        const vendor = await Vendor.findOne({ user: userId });

        let petsDeletedCount = 0;

        if (vendor) {
            // Delete adoption requests where vendor is involved
            const vendorAdoptions = await AdoptionRequest.deleteMany({ vendorId: vendor._id });
            adoptionRequestsDeleted += vendorAdoptions.deletedCount;

            // Delete pets of this vendor
            const pets = await Pet.find({ vendorId: vendor._id });

            for (const pet of pets) {
                // Delete adoption requests linked to each pet
                const petAdoptions = await AdoptionRequest.deleteMany({ petId: pet._id });
                adoptionRequestsDeleted += petAdoptions.deletedCount;
            }

            // Delete the pets
            const petDeleteResult = await Pet.deleteMany({ vendorId: vendor._id });
            petsDeletedCount = petDeleteResult.deletedCount;

            // Delete vendor
            await vendor.deleteOne();
        }

        // Delete adoption requests where user is applicant
        const userAdoptions = await AdoptionRequest.deleteMany({ applicantId: userId });
        adoptionRequestsDeleted += userAdoptions.deletedCount;

        // Delete user
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User and related data deleted successfully',
            details: {
                userDeleted: true,
                vendorDeleted: !!vendor,
                applicationDeleted: !!vendorApplication,
                petsDeleted: petsDeletedCount,
                adoptionRequestsDeleted
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Update Profile Image Controller
export const updateProfileImage = async (req, res) => {
    try {
        const { email, image } = req.body;

        if (!email || !image) {
            return res
                .status(400)
                .json({ success: false, message: "Email and image URL are required." });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        // Update user's profile image
        user.image = image;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully.",
            image: user.image,
        });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};


export const updateProfileAndVendor = async (req, res) => {
    try {
        const { userId, name, contact, address, description } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            name,
            contact,
            address,
            description,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update vendor profile if the user is a vendor
        const updatedVendor = await Vendor.findOneAndUpdate(
            { email: updatedUser.email }, // Assuming email is unique
            {
                fullName: name,
                contact,
                address,
                description,
            },
            { new: true }
        );

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser,
            vendor: updatedVendor || null, // If user is not a vendor, return null
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Fetch the current user (use token or userId to get the user from DB)
        const user = await userModel.findById(req.body.userId);

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const banUser = async (req, res) => {
    try {
        const { userId, remarks, adminId } = req.body;

        if (!userId || !adminId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Admin ID are required"
            });
        }

        const user = await userModel.findById(userId);
        const admin = await userModel.findById(adminId);

        if (!user || !admin) {
            return res.status(404).json({
                success: false,
                message: "User or Admin not found"
            });
        }

        // Calculate unban date (5 minute from now)
        const unbanDate = new Date();
        unbanDate.setMinutes(unbanDate.getMinutes() + 5); // Set unban date to 5 minutes from now

        // Update ban info
        user.banInfo = {
            isBanned: true,
            bannedBy: adminId,
            reason: remarks || "Violation of terms of service",
            at: new Date(),
            willBeUnbannedAt: unbanDate  // Store the scheduled unban date
        };

        await user.save();

        // Schedule auto-unban (after 5 minute)
        setTimeout(async () => {
            try {
                const userToUnban = await userModel.findById(userId);
                if (userToUnban && userToUnban.banInfo.isBanned) {
                    userToUnban.banInfo = {
                        ...userToUnban.banInfo,
                        isBanned: false,
                        unbannedBy: null, // System-initiated
                        unbanReason: 'Automatic unban after 5 minute',
                        unbannedAt: new Date()
                    };
                    await userToUnban.save();

                    // Send unban notification email
                    try {
                        await sendEmail(
                            userToUnban.email,
                            'account-unbanned',
                            {
                                userName: userToUnban.name || userToUnban.username,
                                adminEmail: 'system@nayasathi.com'
                            }
                        );
                    } catch (emailError) {
                        console.error("Email sending failed:", emailError);
                    }

                    // Send WhatsApp message
                    try {
                        await sendWhatsAppMessage(
                            userToUnban.contact,
                            `Hello ${userToUnban.name || userToUnban.username},\n\nYour account has been unbanned by System.\nThank you.`
                        );
                    } catch (whatsAppError) {
                        console.error("WhatsApp message sending failed:", whatsAppError);
                    }
                }
            } catch (error) {
                console.error("Error in auto-unban process:", error);
            }
        }, 60 * 5000); // 5 minute in milliseconds


        // Send email notification
        try {
            await sendEmail(
                user.email,
                'account-banned',
                {
                    userName: user.name || user.username,
                    remarks: remarks || "Violation of terms of service",
                    adminEmail: admin.email,
                    unbanDate: unbanDate.toLocaleTimeString() // Show time instead of date
                }
            );
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        // Send whatsApp message
        try {
            await sendWhatsAppMessage(
                user.contact,
                `Hello ${user.name || user.username},\n\nYour account has been banned due to: ${remarks || "Violation of terms of service"}.\nThank you.`
            );
        } catch (whatsAppError) {
            console.error("WhatsApp message sending failed:", whatsAppError);
        }


        res.status(200).json({
            success: true,
            message: "User banned successfully. Will be automatically unbanned after 1 minute.",
            user,
            unbanTime: unbanDate.toLocaleTimeString() // Return time instead of full date
        });

    } catch (error) {
        console.error("Error banning user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const unbanUser = async (req, res) => {
    try {
        const { userId, adminId, remarks } = req.body;

        if (!userId || !adminId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Admin ID are required"
            });
        }

        const user = await userModel.findById(userId);
        const admin = await userModel.findById(adminId);

        if (!user || !admin) {
            return res.status(404).json({
                success: false,
                message: "User or Admin not found"
            });
        }

        // Update ban info
        user.banInfo = {
            isBanned: false,
            unbannedBy: adminId,
            unbanReason: remarks || "Suspension lifted",
            at: null,
            unbannedAt: new Date()
        };

        await user.save();

        // Send email notification
        try {
            await sendEmail(
                user.email,
                'account-unbanned',
                {
                    userName: user.name || user.username,
                    adminEmail: admin.email
                }
            );
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        // Send whatsApp message
        try {
            await sendWhatsAppMessage(
                user.contact,
                `Hello ${user.name || user.username},\n\nYour account has been unbanned by ${admin.name || admin.username}.\n\nThank you.`
            );
        } catch (whatsAppError) {
            console.error("WhatsApp message sending failed:", whatsAppError);
        }

        res.status(200).json({
            success: true,
            message: "User unbanned successfully",
            user
        });

    } catch (error) {
        console.error("Error unbanning user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getAllAdmins = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'admin' }) // Only fetch users where role is not 'admin'
            .select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt')
            .lean();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await userModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            isAccountVerified: true, // Assuming new admins are verified by default
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({ success: true, message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
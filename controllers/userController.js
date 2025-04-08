import userModel from "../models/userModel.js";
import Vendor from "../models/Vendor.js";
import bcrypt from 'bcryptjs';

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

// Get all users data
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userModel.find({}, 'name email role image isAccountVerified');

        // If no users found
        if (!users.length) {
            return res.json({ success: false, message: 'No users found' });
        }

        // Return all users' data
        res.json({ success: true, users });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Ensure userId is provided
        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        // Find and delete the user
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Return success response
        res.json({ success: true, message: 'User deleted successfully' });
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



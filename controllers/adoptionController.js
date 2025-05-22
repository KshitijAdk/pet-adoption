import AdoptionRequest from '../models/adoptionRequest.model.js';
import Pet from '../models/pet.model.js';
import Vendor from '../models/Vendor.js';
import userModel from '../models/userModel.js';
import { sendAdoptionStatusEmail } from '../config/nodemailer.js';
import { sendWhatsAppMessage } from '../utils/sendWhatsappMsg.js';
import mongoose from 'mongoose';
import VendorApplication from '../models/venderApplication.js';

export const submitAdoptionRequest = async (req, res) => {
    console.log("Request Body:", req.body); // Log request for debugging

    try {
        const {
            adoptionId,
            petId,
            applicantId,
            fullName,
            email,
            applicantImage,
            phone,
            address,
            reasonForAdoption,
        } = req.body;

        // Validate required fields
        if (!adoptionId || !petId || !applicantId || !applicantImage || !fullName || !email || !phone || !address || !reasonForAdoption) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user
        const user = await userModel.findById(applicantId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if pet exists
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Find vendor
        const vendor = await Vendor.findById(pet.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found for this pet" });
        }

        // Check if user already applied for this pet
        const existingRequest = await AdoptionRequest.findOne({
            petId,
            applicantId,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "You already have an active adoption request for this pet",
                existingRequest
            });
        }

        // Create the adoption request
        const newAdoptionRequest = new AdoptionRequest({
            adoptionId,
            applicantId,
            applicantName: fullName,
            applicantEmail: email,
            applicantImage,
            applicantContact: phone,
            applicantAddress: address,
            petId,
            vendorId: vendor._id,
            petName: pet.name,
            adoptionReason: reasonForAdoption,
            status: "Pending"
        });

        // Save the adoption request
        const savedRequest = await newAdoptionRequest.save();

        // Update user's applications
        user.applications.push({
            adoptionId: savedRequest._id,
            petId,
            status: "Pending"
        });
        await user.save();

        res.status(201).json({
            message: "Adoption request submitted successfully",
            adoptionRequest: savedRequest,
        });
    } catch (error) {
        console.error("Error submitting adoption request:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const approveAdoptionRequest = async (req, res) => {
    const { adoptionId } = req.body;

    if (!adoptionId) {
        return res.status(400).json({ message: "Adoption ID is required" });
    }

    try {
        // 1. Approve the adoption request
        const adoptionRequest = await AdoptionRequest.findByIdAndUpdate(
            adoptionId,
            { status: "Approved" },
            { new: true }
        ).populate('applicantId', 'email');

        if (!adoptionRequest) {
            return res.status(404).json({ message: "Adoption request not found" });
        }

        // 2. Mark pet as adopted
        const pet = await Pet.findByIdAndUpdate(
            adoptionRequest.petId,
            {
                status: "Adopted",
                adoptedBy: adoptionRequest.applicantId
            },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Send WhatsApp message
        if (adoptionRequest.applicantContact) {
            const waMessage = `🎉 Congratulations! Your adoption request for ${pet.name} has been approved. Thank you for choosing NayaSathi! 🐾`;
            await sendWhatsAppMessage(adoptionRequest.applicantContact, waMessage);
        }

        // 3. Update user who made the request
        await userModel.findByIdAndUpdate(
            adoptionRequest.applicantId,
            {
                $addToSet: { adoptedPets: adoptionRequest.petId },
                $set: { "applications.$[app].status": "Approved" }
            },
            {
                arrayFilters: [{ "app.adoptionId": adoptionRequest._id }]
            }
        );

        // 4. Reject all other pending requests for this pet
        const rejectedRequests = await AdoptionRequest.find({
            petId: adoptionRequest.petId,
            status: "Pending",
            _id: { $ne: adoptionRequest._id }
        }).populate('applicantId', 'email');

        if (rejectedRequests.length > 0) {
            await AdoptionRequest.updateMany(
                { _id: { $in: rejectedRequests.map(req => req._id) } },
                { status: "Rejected" }
            );

            const bulkOps = rejectedRequests.map(request => ({
                updateOne: {
                    filter: {
                        _id: request.applicantId,
                        "applications.adoptionId": request._id
                    },
                    update: {
                        $set: { "applications.$.status": "Rejected" }
                    }
                }
            }));

            await userModel.bulkWrite(bulkOps);

            // Send rejection emails
            await Promise.all(rejectedRequests.map(async request => {
                const pet = await Pet.findById(request.petId).select('name');
                if (pet && request.applicantId.email) {
                    await sendAdoptionStatusEmail(request.applicantId.email, pet.name, 'Rejected');
                }
            }));
        }

        // Send approval email
        if (adoptionRequest.applicantId.email && pet) {
            await sendAdoptionStatusEmail(adoptionRequest.applicantId.email, pet.name, 'Approved');
        }

        res.status(200).json({
            message: "Adoption request approved successfully",
            adoptionRequest,
            pet,
            rejectedCount: rejectedRequests.length
        });

    } catch (error) {
        console.error("Error approving adoption request:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const rejectAdoptionRequest = async (req, res) => {
    const { adoptionId } = req.body;

    if (!adoptionId) {
        return res.status(400).json({ message: "Adoption ID is required" });
    }

    try {
        // 1. Reject the adoption request
        const adoptionRequest = await AdoptionRequest.findByIdAndUpdate(
            adoptionId,
            { status: "Rejected" },
            { new: true }
        ).populate('applicantId', 'email');

        if (!adoptionRequest) {
            return res.status(404).json({ message: "Adoption request not found" });
        }

        // 2. Update the user's application status
        await userModel.updateOne(
            {
                _id: adoptionRequest.applicantId,
                "applications.adoptionId": adoptionRequest._id
            },
            {
                $set: { "applications.$.status": "Rejected" }
            }
        );

        // 3. Check if pet should be marked available
        const pendingRequestsCount = await AdoptionRequest.countDocuments({
            petId: adoptionRequest.petId,
            status: "Pending"
        });

        if (pendingRequestsCount === 0) {
            await Pet.findByIdAndUpdate(
                adoptionRequest.petId,
                { status: "Available" }
            );
        }

        // 4. Send notifications
        const pet = await Pet.findById(adoptionRequest.petId).select('name');

        if (pet && adoptionRequest.applicantId.email) {
            await sendAdoptionStatusEmail(adoptionRequest.applicantId.email, pet.name, 'Rejected');
        }

        if (adoptionRequest.applicantContact) {
            const waMessage = `😔 We're sorry to inform you that your adoption request for ${pet?.name || 'the pet'} has been rejected. Thank you for your interest in giving a pet a home. 🐾`;
            await sendWhatsAppMessage(adoptionRequest.applicantContact, waMessage);
        }

        res.status(200).json({
            message: "Adoption request rejected successfully",
            adoptionRequest,
            petStatusUpdated: pendingRequestsCount === 0
        });

    } catch (error) {
        console.error("Error rejecting adoption request:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getAdoptedPets = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and populate adopted pets with vendor info
        const user = await userModel.findById(userId)
            .populate({
                path: 'adoptedPets',
                populate: {
                    path: 'vendorId',
                    select: 'organization image contact'
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            adoptedPets: user.adoptedPets,
            count: user.adoptedPets.length
        });
    } catch (error) {
        console.error("Error fetching adopted pets:", error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Get all adoption requests for a vendor
export const getVendorAdoptionRequests = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const requests = await AdoptionRequest.find({ vendorId })
            .populate('petId', 'name imageUrl status breed species size age weight gender health goodWith traits description')
            .populate('applicantId', 'name email contact')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error("Error fetching vendor adoption requests:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// Get user's adoption applications and vendor application if exists
export const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user and populate adoption applications
        const user = await userModel.findById(userId)
            .populate({
                path: 'applications',
                populate: {
                    path: 'petId',
                    select: 'name imageUrl status breed species size age weight gender health goodWith traits description vendorId',
                    populate: {
                        path: 'vendorId',
                        select: 'organization'
                    }
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch full vendor application details if exists
        const vendorApplication = await VendorApplication.findOne({ user: userId })

        res.status(200).json({
            applications: user.applications,
            count: user.applications.length,
            vendorApplication: vendorApplication || null
        });

    } catch (error) {
        console.error("Error fetching user applications:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getAllAdoptionRequests = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready");
        }

        // Get status filter from query params (optional)
        const { status } = req.query;
        const query = status ? { status } : {};

        // Validate status if provided
        if (status && !["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Fetch adoption requests with populated fields
        const adoptionRequests = await AdoptionRequest.find(query)
            .sort({ createdAt: -1 }) // Sort by most recent first
            .populate({
                path: "applicantId",
                select: "name email contact address image"
            })
            .populate({
                path: "petId",
                select: "name species breed age gender status imageUrl"
            })
            .populate({
                path: "vendorId",
                select: "organization email contact address"
            })
            .lean(); // Convert to plain JavaScript objects for performance

        // Check if any requests were found
        if (!adoptionRequests.length) {
            return res.status(200).json({
                message: "No adoption requests found",
                data: []
            });
        }

        // Format response
        const formattedRequests = adoptionRequests.map(request => ({
            adoptionId: request.adoptionId,
            status: request.status,
            createdAt: request.createdAt,
            adoptionReason: request.adoptionReason,
            applicant: {
                id: request.applicantId?._id,
                name: request.applicantId?.name,
                email: request.applicantId?.email,
                contact: request.applicantId?.contact,
                address: request.applicantId?.address,
                image: request.applicantId?.image
            },
            pet: {
                id: request.petId?._id,
                name: request.petId?.name,
                species: request.petId?.species,
                breed: request.petId?.breed,
                age: request.petId?.age,
                gender: request.petId?.gender,
                status: request.petId?.status,
                imageUrl: request.petId?.imageUrl
            },
            vendor: {
                id: request.vendorId?._id,
                organization: request.vendorId?.organization,
                email: request.vendorId?.email,
                contact: request.vendorId?.contact,
                address: request.vendorId?.address
            }
        }));

        res.status(200).json({
            message: "Adoption requests fetched successfully",
            total: adoptionRequests.length,
            data: formattedRequests
        });

    } catch (error) {
        console.error("Error fetching adoption requests:", error.message);
        res.status(500).json({ message: `Failed to fetch adoption requests: ${error.message}` });
    }
};
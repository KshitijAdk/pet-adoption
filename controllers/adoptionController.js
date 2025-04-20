import AdoptionRequest from '../models/adoptionRequest.model.js';
import Pet from '../models/pet.model.js';
import Vendor from '../models/Vendor.js';
import userModel from '../models/userModel.js';
import { sendAdoptionStatusEmail } from '../config/nodemailer.js';

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
            // Update status in AdoptionRequest collection
            await AdoptionRequest.updateMany(
                { _id: { $in: rejectedRequests.map(req => req._id) } },
                { status: "Rejected" }
            );

            // Update status in users' applications
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

            // Send rejection emails to all rejected applicants
            await Promise.all(rejectedRequests.map(async request => {
                const pet = await Pet.findById(request.petId).select('name');
                if (pet && request.applicantId.email) {
                    await sendAdoptionStatusEmail(request.applicantId.email, pet.name, 'Rejected');
                }
            }));
        }

        // Send approval email to the approved applicant
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
        // 1. Reject the adoption request and get applicant info
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

        // 3. If this was the only pending request for the pet, mark pet as available again
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

        // Send rejection email to the applicant
        const pet = await Pet.findById(adoptionRequest.petId).select('name');
        if (pet && adoptionRequest.applicantId.email) {
            await sendAdoptionStatusEmail(adoptionRequest.applicantId.email, pet.name, 'Rejected');
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

// Get user's adoption applications
export const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;

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

        res.status(200).json({
            applications: user.applications,
            count: user.applications.length
        });
    } catch (error) {
        console.error("Error fetching user applications:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
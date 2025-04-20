import mongoose from "mongoose";
import Pet from "../models/pet.model.js";
import User from "../models/userModel.js";
import Vendor from "../models/Vendor.js";
import AdoptionRequest from "../models/adoptionRequest.model.js";
import VendorApplication from "../models/venderApplication.js";

// Helper function to get date ranges
const getDateRanges = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return { today, yesterday, lastMonth };
};

export const getDashboardStats = async (req, res) => {
    try {
        const { today, yesterday, lastMonth } = getDateRanges();

        // Total counts
        const totalPets = await Pet.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalVendors = await Vendor.countDocuments();
        const totalApplications = await AdoptionRequest.countDocuments();
        const pendingVendorApps = await VendorApplication.countDocuments({ status: "Pending" });

        // Pet statistics
        const totalDogs = await Pet.countDocuments({ species: "Dog" });
        const totalCats = await Pet.countDocuments({ species: "Cat" });
        const petsAddedToday = await Pet.countDocuments({ createdAt: { $gte: today } });
        const petsAddedThisMonth = await Pet.countDocuments({ createdAt: { $gte: lastMonth } });

        // Adoption statistics
        const adoptionsToday = await AdoptionRequest.countDocuments({
            createdAt: { $gte: today },
            status: "Approved"
        });
        const adoptionsThisMonth = await AdoptionRequest.countDocuments({
            createdAt: { $gte: lastMonth },
            status: "Approved"
        });
        const pendingAdoptions = await AdoptionRequest.countDocuments({ status: "Pending" });

        // Recent activity
        const recentPets = await Pet.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("vendorId", "organization");

        const recentAdoptions = await AdoptionRequest.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("petId", "name species")
            .populate("applicantId", "name email");

        const recentVendorApps = await VendorApplication.find({ status: "Pending" })
            .sort({ createdAt: -1 })
            .limit(5);

        // Status distribution
        const petStatusStats = await Pet.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const adoptionStatusStats = await AdoptionRequest.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Monthly trends (last 6 months)
        const monthlyPetTrends = await Pet.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 }
        ]);

        const monthlyAdoptionTrends = await AdoptionRequest.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    },
                    status: "Approved"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 }
        ]);

        res.status(200).json({
            totals: {
                pets: totalPets,
                users: totalUsers,
                vendors: totalVendors,
                adoptions: totalApplications,
                pendingVendorApps
            },
            petStats: {
                dogs: totalDogs,
                cats: totalCats,
                addedToday: petsAddedToday,
                addedThisMonth: petsAddedThisMonth,
                statusDistribution: petStatusStats
            },
            adoptionStats: {
                approvedToday: adoptionsToday,
                approvedThisMonth: adoptionsThisMonth,
                pending: pendingAdoptions,
                statusDistribution: adoptionStatusStats
            },
            trends: {
                pets: monthlyPetTrends,
                adoptions: monthlyAdoptionTrends
            },
            recentActivity: {
                pets: recentPets,
                adoptions: recentAdoptions,
                vendorApplications: recentVendorApps
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDetailedStats = async (req, res) => {
    try {
        const { period } = req.query; // 'day', 'week', 'month', 'year'
        let startDate = new Date();

        switch (period) {
            case 'day':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 1);
        }

        // Pet statistics by period
        const petsAdded = await Pet.countDocuments({ createdAt: { $gte: startDate } });
        const petsBySpecies = await Pet.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: "$species", count: { $sum: 1 } } }
        ]);

        // Adoption statistics by period
        const adoptions = await AdoptionRequest.countDocuments({
            createdAt: { $gte: startDate },
            status: "Approved"
        });

        // User statistics by period
        const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
        const newVendors = await Vendor.countDocuments({ createdAt: { $gte: startDate } });

        res.status(200).json({
            period,
            startDate,
            stats: {
                petsAdded,
                petsBySpecies,
                adoptions,
                newUsers,
                newVendors
            }
        });

    } catch (error) {
        console.error("Error fetching detailed stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
import userModel from "../models/userModel.js";
import Vendor from "../models/Vendor.js";

export const getUserFavoritePets = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user first
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favoritePetIds = user.favoritePets;

        // Fetch vendors that have pets matching favorite pet IDs
        const vendors = await Vendor.find({ "pets._id": { $in: favoritePetIds } });

        // Collect matching pets and exclude adoptionRequests
        const favoritePets = [];
        vendors.forEach(vendor => {
            vendor.pets.forEach(pet => {
                if (favoritePetIds.includes(pet._id.toString())) {
                    const {
                        adoptionRequests, // destructuring to exclude
                        ...petWithoutAdoptionRequests
                    } = pet.toObject(); // convert Mongoose document to plain object

                    favoritePets.push({
                        ...petWithoutAdoptionRequests,
                        vendorId: vendor._id,
                        vendorName: vendor.fullName
                    });
                }
            });
        });

        return res.status(200).json({ favoritePets });

    } catch (error) {
        console.error("Error fetching user's favorite pets:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

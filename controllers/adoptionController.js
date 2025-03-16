import Vendor from "../models/Vendor.js";

export const submitAdoptionRequest = async (req, res) => {
    try {
        const {
            petId,
            fullName,
            email,
            phone,
            address,
            reasonForAdoption,
        } = req.body;

        // Find the vendor who owns the pet
        const vendor = await Vendor.findOne({ "pets._id": petId });

        if (!vendor) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Find the specific pet from the vendor's pets array
        const pet = vendor.pets.id(petId);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Create the adoption request object
        const adoptionRequest = {
            applicantName: fullName,
            applicantEmail: email,
            applicantContact: phone,
            applicantAddress: address,
            petId: pet._id,
            petName: pet.name,
            adoptionReason: reasonForAdoption,
            status: "Pending",
            createdAt: new Date(),
        };

        // Push the adoption request to the pet's adoptionRequests array
        pet.adoptionRequests.push(adoptionRequest);

        // Save the updated vendor document
        await vendor.save();

        res.status(201).json({ message: "Adoption request submitted successfully" });
    } catch (error) {
        console.error("Error submitting adoption request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
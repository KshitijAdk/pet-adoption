import express from "express";
import { addPetToVendor, getPetData, deletePet, toggleFavorite } from "../controllers/petController.js";

const router = express.Router();

// Route to add a pet to a vendor
router.post("/add/:vendorId", addPetToVendor);
// router.get('/:vendorId/pets', getPetsByVendor);
router.delete("/delete-pet", deletePet); // DELETE request to remove a pet
router.get("/:petId", getPetData);
router.post("/toggle-favorite", toggleFavorite);


export default router;

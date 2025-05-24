import express from "express";
import {
    addPetToVendor,
    getPetData,
    deletePet,
    getPetsByVendor,
    getAllPetsWithVendor,
    addToFavourite,
    removeFromFavourite,
    getFavouritePets,
    getAllPets,
    updatePetById,
    lockPet,
    unlockPet
} from "../controllers/petController.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// Route to add a pet to a vendor
router.post("/add", upload.single('image'), addPetToVendor);
router.get('/getPets', getPetsByVendor);
router.delete('/:petId', deletePet);
router.get("/petDetails/:petId", getPetData);
router.get('/pets-with-vendor', getAllPetsWithVendor);
router.post("/add-to-favourite", addToFavourite);
router.post("/remove-from-favourite", removeFromFavourite);
router.get("/favourite/:userId", getFavouritePets);
router.get("/all-pets", getAllPets);
router.put('/:id', upload.single('image'), updatePetById); // 🆕 added route to update pet details

router.post('/lock', lockPet);
router.post('/unlock', unlockPet);

export default router;

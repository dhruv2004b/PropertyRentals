import express from 'express';
import { createListing, deleteListing, updateListing, uploadImages } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route for uploading Base64 images
router.post('/upload', uploadImages);
// Route for creating a listing
router.post('/create', verifyToken, createListing);

router.delete('/delete/:id', verifyToken, deleteListing);

router.post('/update/:id',verifyToken,updateListing);
export default router;
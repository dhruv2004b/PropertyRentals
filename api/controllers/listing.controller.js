import Listing from "../models/listing.model.js";

import mongoose from 'mongoose';



export const uploadImages = async (req, res, next) => {
    try {
        const { images } = req.body; // Get Base64 strings from the request body

        // Validate the images array
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded or invalid format" });
        }

        // Save Base64 strings as image URLs
        const imageUrls = images.map((base64) => {
            return base64; // Store the Base64 string directly
        });

        res.status(200).json({ success: true, imageUrls });
    } catch (error) {
        console.error("Error in uploadImages:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create({
            ...req.body,
            userRef: req.user.id, // Add the user ID
        });
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};


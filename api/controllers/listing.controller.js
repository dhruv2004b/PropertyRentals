import Listing from "../models/listing.model.js";

import mongoose from 'mongoose';
import { errorHandler } from "../utils/error.js";


export const uploadImages = async (req, res) => {
    try {
        // Extract images from request body
        const { images } = req.body;
        
        // Log request details for debugging
        console.log("Upload request received");
        console.log("Request body has images array:", !!images && Array.isArray(images));
        
        // Validate the images array
        if (!images || !Array.isArray(images) || images.length === 0) {
            console.error("Invalid images array in request");
            return res.status(400).json({ 
                success: false, 
                message: "No images provided or invalid format" 
            });
        }
        
        console.log(`Processing ${images.length} images`);
        
        // Process each image
        const imageUrls = [];
        
        for (const base64Image of images) {
            // Basic validation
            if (!base64Image || typeof base64Image !== 'string') {
                console.error("Invalid image format - not a string");
                continue;
            }
            
            if (!base64Image.startsWith('data:image/')) {
                console.error("Invalid image format - not a valid base64 image");
                continue;
            }
            
            // Store the image
            imageUrls.push(base64Image);
        }
        
        // Return the results
        if (imageUrls.length === 0) {
            console.error("No valid images were found");
            return res.status(400).json({ 
                success: false, 
                message: "No valid images were found" 
            });
        }
        
        console.log(`Successfully processed ${imageUrls.length} images`);
        return res.status(200).json({ success: true, imageUrls });
        
    } catch (error) {
        console.error("Error processing images:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while processing images", 
            error: error.message 
        });
    }
};


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create({
            ...req.body,
            userRef: req.user.id,
        });
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing=async(req,res,next)=>{
    const listing= await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404,'Listing not found !!'));
    }

    if(req.user.id!== listing.userRef)
    {
        return next(errorHandler(401,'You can only delete your ownm listing !!'));

    }
    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted !!');

    }catch(error)
    {
        next(error);
    }

};

export const updateListing=async(req,res,next)=>{
    const listing= await Listing.findById(req.params.id);
    if(!listing)
    {
        return next(errorHandler(404,'Listing not found !!'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only update your own listings !!'));
    }
    try
    {
        const updatedListing= await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.statue(200).json(updatedListing);
    }catch(error)
    {
        next(error);
    }
}

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import cors from "cors";
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log(`Connected to DB`);

}).catch((err)=>{
    console.log(err);
})

const app= express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 

app.use(express.json({ limit: "50mb" })); // Increase the payload size limit to 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase the URL-encoded payload size limit
app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests from this origin
        credentials: true, // Allow cookies to be sent
    })
);
const port= 3000;

app.listen(port,()=>{
    console.log(`app is running on port ${port}`);
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use((err,req ,res , next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
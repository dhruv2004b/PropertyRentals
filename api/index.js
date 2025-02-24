import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log(`Connected to DB`);

}).catch((err)=>{
    console.log(err);
})

const app= express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000", // Change this to match your frontend URL
    credentials: true,  // allows cookies in request
  }));
const port= 3000;

app.listen(port,()=>{
    console.log(`app is running on port ${port}`);
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

app.use((err,req ,res , next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
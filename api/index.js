import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log(`Connected to DB`);

}).catch((err)=>{
    console.log(err);
})

const app= express();
app.use(express.json());
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
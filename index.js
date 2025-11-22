import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import userRoutes from './routes/userRoutes.js';
import docRoutes from './routes/docRoutes.js';
import cookieParser from 'cookie-parser';
import { isLoggedIn, noCache } from './middlewares.js';
import Doctor from './models/docModel.js';
import Availability from './models/availabilityModel.js';
// import paymentRoutes from './routes/paymentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

app.listen('8080', (req, res) => {
    console.log("App is listening on port 8080");
})

async function main() {
    // await mongoose.connect('mongodb://localhost:27017/MedSched');
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Yes, it is connected');
}

main()
    .then((res) => {
        console.log('DB connected');
    }).catch((err) => {
        console.log(process.env.MONGO_URI);
        console.log('DB not Connected');
        console.log(err);
    })

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: "https://med-schend-frontend.vercel.app/",
    credentials: true
}));

app.use('/patient', userRoutes);
app.use('/doctor', docRoutes);
// app.use('/payment', paymentRoutes);
app.use('/appointment', appointmentRoutes)

app.get('/getme', noCache, isLoggedIn, async (req, res) => {
    try {
        if(!req.user) return res.status(500).json({ message: "You are not logged In!" });
        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

app.post('/logout', async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
    }catch(err){
        console.log(err);
    }

    return res.json({ message: "Logged Out Successfully!" });
})

app.get('/getAllDoctors', async (req, res) => {
    try{
        const doctors = await Doctor.find({}).select('-email -password');
        res.status(201).json(doctors);
    }catch(err){
        console.log(err);
    }
})

app.get('/getTheDoctor', isLoggedIn, async (req, res) => {
    try{
        const { id } = req.query;
        const doctor = await Doctor.findById(id).select('-email -password');
        const slotes = await Availability.find({doctor: id});

        res.status(201).json({doctor: doctor, slotes: slotes});
    }catch(error){
        res.status(401).json({message: error.message});
        console.log(error);
    }
})

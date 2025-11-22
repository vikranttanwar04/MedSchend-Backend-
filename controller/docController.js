import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import Doctor from "../models/docModel.js";
import bcrypt from "bcrypt";
import ExpressError from "../src/custom_error_msg/custom_error_msg.js";
import jwt from 'jsonwebtoken';
import Availability from "../models/availabilityModel.js";
import Appointment from "../models/appointmentModel.js";



export const signup = async (req, res) => {
    try {
        const { name, age, gender, address, speciality, fee, isAvailable, experience, email, password, role, about, degree } = req.body.data;

        const existingUser = await Doctor.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Doctor already exists with this email!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Image Handling
        let newDoctor;
        if (req.file) {
            const res = await uploadToCloudinary(req.file);
            const image = {
                url: await res.secure_url,
                id: await res.public_id
            }
            newDoctor = await new Doctor({ name, age, gender, address, speciality, fee, isAvailable, experience, email, password: hashedPassword, role, image, about, degree });
            await newDoctor.save();
        } else {
            newDoctor = await new Doctor({ name, age, gender, address, speciality, fee, isAvailable, experience, email, password: hashedPassword, role, about, degree });
            await newDoctor.save();
        }

        // creating token and sending through cookie so that user automatically logged in after signup
        const token = jwt.sign({ id: newDoctor._id, role: newDoctor.role }, process.env.JWT_SECRET);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.status(200).json({ message: "Doctor registered successfully", newDoctor });
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Doctor.findOne({ email });
        if (!user) return res.status(400).json({ message: "No registered doctor found with this gmail!" });

        const isMatched = bcrypt.compare(password, user.password);
        if (!isMatched) return res.status(400).json({ message: "Incorrect Password!" });

        // create JWT token (will be sent to frontend after login)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })

        res.status(200).json({ message: "Login Successful." });
    } catch (err) {
        throw new ExpressError(400, err.message);
    }
}

export const provide_slotes = async (req, res) => {
    try {
        const { doctor, date, slotes } = req.body;

        let isDateAlreadyExist = await Availability.findOne({ doctor, date });

        if (isDateAlreadyExist) {
            // isDateAlreadyExist.slotes = [...isDateAlreadyExist.slotes, ...singleTime];
            isDateAlreadyExist.slotes = [...isDateAlreadyExist.slotes, ...slotes];
            await isDateAlreadyExist.save();
            return res.status(200).json({ message: "New slote added." });
        } else {
            // const newAvailability = new Availability({doctor, date, slotes: singleTime});
            const newAvailability = new Availability({ doctor, date, slotes });
            await newAvailability.save();
            return res.status(200).json({ message: "New slote added!" });
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

export const getAllSlotes = async (req, res) => {
    try {
        const { id } = req.query;
        const slotes = await Availability.find({ doctor: id });

        res.status(200).json(slotes);
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: err.message });
    }
}

export const getAllAppointments = async (req, res) => {
    const { id } = req.query;
    try {
        const data = await Appointment.find({ doctor: id }).populate("user");
        return res.status(201).json(data);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const profileUpdate = async (req, res) => {
    const { name, _id, age, gender, address, speciality, fee, isAvailable, experience, email, role, about, degree } = req.body.data;

    try {
        if (req.file) {
            const res_image = await uploadToCloudinary(req.file);
            const image = {
                url: await res_image.secure_url,
                id: await res_image.public_id
            }
            await Doctor.updateOne({ _id }, { $set: { image, name, age, gender, address, speciality, fee, isAvailable, experience, email, role, about, degree }});
    
            return res.status(200).json({ message: "Profile updated successfully." });
        }
    
        await Doctor.updateOne({ _id }, { $set: { name, age, gender, address, speciality, fee, isAvailable, experience, email, role, about, degree } })
        return res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

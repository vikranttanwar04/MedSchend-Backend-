import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import ExpressError from '../src/custom_error_msg/custom_error_msg.js';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
    try {
        const { name, age, gender, address, mobile, email, password, role } = req.body.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists with this email!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Image Handling
        let newUser;
        if (req.file) {
            const res = await uploadToCloudinary(req.file);
            const image = {
                url: await res.secure_url,
                id: await res.public_id
            }
            newUser = await new User({ name, age, gender, address, mobile, email, password: hashedPassword, role, image })
            await newUser.save();
        } else {
            newUser = await new User({ name, age, gender, address, mobile, email, password: hashedPassword, role })
            await newUser.save();
        }

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

        await res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none'
        })

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        throw new ExpressError(500, err.message);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "No registered patient found with this gmail!" });

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) return res.status(400).json({ message: "Incorrect Password!" });

        // create JWT token (will be sent to frontend after login)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ message: "Login Successfull" });
    } catch (err) {
        throw new ExpressError(400, err.message);
    }
}

export const patientProfileUpdate = async (req, res) => {
    try {
        const { _id, name, age, gender, address, mobile, email, role } = req.body.data;

        if (req.file) {
            const res_image = await uploadToCloudinary(req.file);
            const image = {
                url: await res_image.secure_url,
                id: await res_image.public_id
            }
            await User.updateOne({ _id }, { $set: { image, name, age, gender, address, mobile, email, role } });

            return res.status(200).json({ message: "Profile updated successfully." });
        }

        await User.updateOne({ _id }, { $set: { name, age, gender, address, mobile, email, role } })
        return res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

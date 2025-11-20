import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
        required: true,
    },
    image: {
        url: { type: String, default: 'https://www.shutterstock.com/image-vector/doctor-icon-600nw-224509450.jpg' },
        id: { type: String, default: uuid() },
    },
    address: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    experience: {
        type: Number,
        min: 0,
        max: 60,
        required: true
    },
    role: {
        type: String,
        default: "doctor",
        required: true
    },
    about: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    }
})

const Doctor = new mongoose.model("Doctor", DoctorSchema);

export default Doctor; 
import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    image: {
        url: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYCi9I9mpeMzm-iQFEMahQsCdtwLxKLn2keg&s'},
        id: { type: String, default: uuid()},
    },
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'patient',
        required: true,
    }
})

const User = new mongoose.model("User", UserSchema);

export default User;
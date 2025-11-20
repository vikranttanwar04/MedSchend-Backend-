import jwt from 'jsonwebtoken';
import ExpressError from './src/custom_error_msg/custom_error_msg.js';
import { appointmentSchema, availabilitySchema, doctorProfileUpdateSchema, doctorSchema, patientProfileUpdateSchema, patientSchema } from './src/validation/validation.js';
import User from './models/userModel.js';
import Doctor from './models/docModel.js';
import Availability from './models/availabilityModel.js';

export const validateDoctor = (req, res, next) => {
    let { value, error } = doctorSchema.validate(JSON.parse(req.body.data));

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body.data = value;
        next();
    }
}

export const validateDoctorProfileUpdate = (req, res, next) => {
    let { value, error } = doctorProfileUpdateSchema.validate(JSON.parse(req.body.data));

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body.data = value;
        next();
    }
}

export const validatePatient = (req, res, next) => {
    const { error, value } = patientSchema.validate(JSON.parse(req.body.data));

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body.data = value;
        next();
    }
}

export const validatePatientProfileUpdate = (req, res, next) => {
    let { value, error } = patientProfileUpdateSchema.validate(JSON.parse(req.body.data));

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body.data = value;
        next();
    }
}

export const isLoggedIn = async (req, res, next) => {

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "You are not logged in!" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified.role === 'doctor') {
            req.user = await Doctor.findById(verified.id).select("-password");
        } else {
            req.user = await User.findById(verified.id).select("-password");
        }

        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const roleAuth = (requiredRoles, req, res, next) => {
    try {
        if (requiredRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: `Only ${requiredRoles.join(", ")} can access this page.` })
        }
    } catch (err) {
        throw new ExpressError(400, err.message);
    }
}

export const noCache = (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
}

export const organiseDoctorProvidedSlote = async (req, res, next) => {
    try {
        const { doctor, date, slotes } = req.body;
        const isDateAlreadyExist = await Availability.findOne({ doctor, date });
        if (isDateAlreadyExist) {
            // Checking if the time slote already exists for the date or not
            for (let slote of isDateAlreadyExist.slotes) {
                if (slotes.includes(slote.time)) throw new Error("Given Time slote for this date is already exists!");
            }
        }

        // The time slotes are coming in array ["20:00-21:00", "21:00-22:00"] converting each in object {time: "20:00-21:00", isBooked: false}
        let singleTime = [];
        for (let time of slotes) {
            singleTime = [...singleTime, { time: time, isBooked: false }];
        }

        // After converting assining the appropriate-slotes(in object with isBooked) to req.body.slotes
        req.body.slotes = singleTime;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const validateDoctorProvidedSlote = (req, res, next) => {
    const { error } = availabilitySchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

export const validateAppointmentBooking = (req, res, next) => {
    console.log(req.body.bookingData);
    const { value, error } = appointmentSchema.validate(req.body.bookingData);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.body.bookingData = value;
        console.log(req.body.bookingData);
        next();
    }
}
import Joi from "joi";

const doctorSchema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().min(18).max(60).required(),
    degree: Joi.string().min(2).required(),
    about: Joi.string().min(50).required(),
    speciality: Joi.string().min(5).required(),
    fee: Joi.number().min(0).default(0),
    gender: Joi.string().min(3).required(),
    address: Joi.string().min(10).required(),
    isAvailable: Joi.boolean().default(false),
    experience: Joi.number().min(0).max(60).default(0),
    role: Joi.string().valid("doctor"),
})

const doctorProfileUpdateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(18).max(60).required(),
    degree: Joi.string().required(),
    about: Joi.string().min(50).required(),
    speciality: Joi.string().min(5).required(),
    fee: Joi.number().min(0).required(),
    gender: Joi.string().min(3).required(),
    address: Joi.string().min(10).required(),
    isAvailable: Joi.boolean().default(false),
    experience: Joi.number().min(0).max(60).required(),
    role: Joi.string().valid("doctor"),
    image: Joi.object({url: Joi.string().uri(), id: Joi.string()}),
    __v: Joi.number()
})

const patientSchema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().min(1).max(120).required(),
    gender: Joi.string().min(3).required(),
    address: Joi.string().min(10).required(),
    role: Joi.string().valid("patient"),
})

const patientProfileUpdateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    age: Joi.number().min(1).max(120).required(),
    gender: Joi.string().min(3).required(),
    address: Joi.string().min(10).required(),
    role: Joi.string().valid("patient"),
    image: Joi.object({url: Joi.string().uri(), id: Joi.string()}),
    __v: Joi.number()
})

const availabilitySchema = Joi.object({
    doctor: Joi.string().required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    slotes: Joi.array().items(
        Joi.object({time: Joi.string().required(), isBooked: Joi.boolean().default(false)})
    ).min(1).unique('time').required()
})

const appointmentSchema = Joi.object({
    user: Joi.string().required(),
    bookingFor: Joi.string().required(),
    doctor: Joi.string().required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    time: Joi.string().required(),
    payment: Joi.string().valid("COM", "online").default("COM"),
    status: Joi.string().valid("booked", "cancelled", "completed").default("booked"),
})

export { doctorSchema, doctorProfileUpdateSchema, patientSchema, patientProfileUpdateSchema, availabilitySchema, appointmentSchema };
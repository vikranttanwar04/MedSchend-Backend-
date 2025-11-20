import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingFor: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true},
    payment: { type: String, enum: ["COM", "online"], default: "COM" },
    status: { type: String, enum: ["booked", "cancelled", "completed"], default: "booked" },
    bookedAt : { type: Date, default: new Date }
});

// muliple appointments must be booked for a doctor by patient on same date but with different times slotes
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

const Appointment = new mongoose.model("Appointment", appointmentSchema);

export default Appointment;
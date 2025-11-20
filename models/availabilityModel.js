import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    slotes: [ {time: { type: String, required: true }, isBooked: { type: Boolean, default: false }} ]
})

const Availability = new mongoose.model("Availability", availabilitySchema);

export default Availability;
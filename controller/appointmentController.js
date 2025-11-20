import Appointment from "../models/appointmentModel.js";
import Availability from "../models/availabilityModel.js";

export const bookAppointment = async (req, res) => {
    try {
        const { id } = req.query;   // selected time-slote id so that we can modify its isBooked to true
        const { user, bookingFor, doctor, date, time, payment } = req.body.bookingData;
        const isSloteAlreadyBooked = await Appointment.findOne({ doctor, date, time, status: "booked" });

        if (!isSloteAlreadyBooked) {
            const newAppointment = await new Appointment({ user, bookingFor, doctor, date, time, payment });
            await newAppointment.save();
            await Availability.updateOne(
                { doctor, date, "slotes._id": id },
                { $set: { "slotes.$.isBooked": true } }
            );
        } else if (isSloteAlreadyBooked) {
            return res.status(400).json({ message: "This time-slote for following date is already booked." });
        }

        res.status(201).json({ message: "Appointment is booked successfully." });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

export const completeAppointment = async (req, res) => {
    try {
        const { id } = req.query;

        const booking = await Appointment.findById(id);
        
        if(booking.status === "booked"){
            booking.status = "completed";
            booking.save();
        }else if(booking.status === "completed"){
            return res.status(401).json({message: "The Appointment is already completed."});
        }else if(booking.status === "cancelled"){
            return res.status(401).json({message: "The Appointment is already cancelled."});
        }
        res.status(201).json({message: "Appointment is successfully completed."});
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message: error.message});
    }
}

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.query;

        const booking = await Appointment.findById(id);
        const {doctor, date, time} = booking;
        
        if(booking.status === "booked"){
            booking.status = "cancelled";
            booking.save();
            await Availability.updateOne(
                { doctor, date, "slotes.time": time },
                { $set: { "slotes.$.isBooked": false } }
            );
        }else if(booking.status === "completed"){
            return res.status(401).json({message: "The Appointment is already completed."});
        }else if(booking.status === "cancelled"){
            return res.status(401).json({message: "The Appointment is already cancelled."});
        }
        res.status(201).json({message: "Appointment has been cancelled."});
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message: error.message});
    }
}



export const getUserAppointments = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await Appointment.find({ user: id }).populate("doctor");
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}
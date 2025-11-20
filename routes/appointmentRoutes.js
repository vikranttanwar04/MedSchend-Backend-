import express from "express";
import { isLoggedIn, validateAppointmentBooking } from "../middlewares.js";
import { bookAppointment, cancelAppointment, completeAppointment, getUserAppointments } from "../controller/appointmentController.js";

const router = express.Router();

router.post('/book', isLoggedIn, validateAppointmentBooking, bookAppointment);

router.post('/completed', isLoggedIn, completeAppointment);

router.post('/cancelled', isLoggedIn, cancelAppointment);

router.get('/getUserAppointments', isLoggedIn, getUserAppointments);

export default router;
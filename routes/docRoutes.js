import express from 'express';
import upload from '../src/ImageUpload/multer.js';
import { isLoggedIn, organiseDoctorProvidedSlote, validateDoctor, validateDoctorProfileUpdate, validateDoctorProvidedSlote } from '../middlewares.js';
import { getAllAppointments, getAllSlotes, login, profileUpdate, provide_slotes, signup } from '../controller/docController.js';

const router = express.Router();

router.route('/auth/signup')
.post(upload.single('image'), validateDoctor, signup);

router.route('/auth/login')
.post(login);

router.route('/provide_slotes')
.post(isLoggedIn, organiseDoctorProvidedSlote, validateDoctorProvidedSlote, provide_slotes);

router.route('/getAllSlotes')
.get(isLoggedIn, getAllSlotes);

router.route('/getAllAppointments')
.get(isLoggedIn, getAllAppointments);

router.route('/profileUpdate')
.put(isLoggedIn, upload.single('image'), validateDoctorProfileUpdate, profileUpdate);

export default router;
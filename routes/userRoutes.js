import express from 'express';
import { login, patientProfileUpdate, signup } from '../controller/userController.js';
import { isLoggedIn, validatePatient, validatePatientProfileUpdate } from '../middlewares.js';
import upload from '../src/ImageUpload/multer.js';

const router = express.Router();

router.route('/auth/signup')
.post(upload.single('image'), validatePatient, signup);

router.route('/auth/login')
.post(login);

router.route('/profileUpdate')
.put(isLoggedIn, upload.single('image'), validatePatientProfileUpdate, patientProfileUpdate);

export default router;
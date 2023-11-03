import express from "express";
import { googleAuth, logoutController, failureRedirect, successRedirect } from "../controllers/authController.js";
const router = express.Router();


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', googleAuth); 


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', failureRedirect, successRedirect);


// @desc    Logout User
// @route   /auth/logout
router.get('/logout', logoutController);

export default router;
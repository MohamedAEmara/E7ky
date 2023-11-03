import express from "express";
const router = express.Router();
import { ensureAuth, ensureGuest } from "../middleware/auth.js";
import { getDashboard, getLoginPage } from "../controllers/userController.js";
// @desc    Login/Landing Page
// @route   GET / 
router.get('/dashboard', ensureAuth, getDashboard); 


// @desc    Dashboard
// @route   GET /dashboard

// To specify which layout will be applied for this route.
// We can pass it as a second argument 
router.get('/', ensureGuest, getLoginPage);




export default router;
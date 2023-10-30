import express from "express";
const router = express.Router();


// @desc    Login/Landing Page
// @route   GET / 
router.get('/dashboard', (req, res) => {res.render('dashboard')}); 


// @desc    Dashboard
// @route   GET /dashboard

// To specify which layout will be applied for this route.
// We can pass it as a second argument 
router.get('/', (req, res) => {res.render('login', {
    layout: 'login'
})});




export default router;
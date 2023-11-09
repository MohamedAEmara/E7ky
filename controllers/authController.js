import passport from "passport";

export const googleAuth = passport.authenticate('google', {
    scope: ["profile", "email"]
})

export const failureRedirect = passport.authenticate('google', {
    failureRedirect: '/welcome_new'
});

export const successRedirect = (req, res) => {
    console.log("Redirect to Dashboard..");
    res.redirect('/dashboard');
}




export const logoutController = (req, res) => {
    req.logout();
    res.redirect('/');
}
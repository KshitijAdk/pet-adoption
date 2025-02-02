import passport from 'passport';

// Function to initiate Google OAuth
export const googleAuth = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Callback function after Google OAuth
export const googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/auth/failed' })(req, res, () => {
        res.redirect('http://localhost:5173/'); // Redirect to frontend home page
    });
};

export const getCurrentUser = (req, res) => {
    console.log("Session:", req.session); // Debugging session data
    console.log("User from session:", req.user); // Debugging user data

    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);  // Return the user profile data
};




// Function to log out
export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/'); // Redirect to home page after logout
    });
};

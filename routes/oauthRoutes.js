import express from 'express';
import passport from 'passport';
import {
  googleAuth,
  googleAuthCallback,
  getCurrentUser,
  logout,
} from '../controllers/oauthController.js';

const oauthRouter = express.Router();

// Route to start Google OAuth
oauthRouter.get('/google', googleAuth);

// Callback route after Google OAuth
oauthRouter.get('/google/callback', googleAuthCallback);

// Route to handle failed authentication
oauthRouter.get('/auth/failed', (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
});

// Route to get the current authenticated user
oauthRouter.get('/current-user', getCurrentUser);

// Route to log out
oauthRouter.get('/logout', logout);

export default oauthRouter;

import express from 'express';
import connectDB from './db.js';  // Import the DB connection
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import oauthRouter from './routes/oauthRoutes.js';

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true })); // For form-data (application/x-www-form-urlencoded)
app.use(express.json()); // Middleware to parse JSON data
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow all origins dynamically
    },
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,  // Only create session if authenticated
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      httpOnly: true, // Ensures the cookie can't be accessed via JavaScript
      maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time (24 hours)
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // Debugging
      return done(null, profile); // Save profile data in the session
    }
  )
);

// Serialize the user into the session
passport.serializeUser((user, done) => {
  done(null, user); // Store the user object directly in the session
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user); // Retrieve the full user data from the session
});

app.get('/', (req, res) => {
  res.send("API Working");
});

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/auth', oauthRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

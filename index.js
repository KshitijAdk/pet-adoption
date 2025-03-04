import express from 'express';
import connectDB from './db.js';  // Import the DB connection
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js'
// import session from 'express-session';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import passport from 'passport';
// import oauthRouter from './routes/oauthRoutes.js';
// import userModel from './models/userModel.js';

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
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // HTTPS in production
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// // Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await userModel.findOne({ email: profile.emails[0].value });

//         if (!user) {
//           // Create a new user if they don't exist
//           user = await userModel.create({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             image: profile.photos[0].value, // Save Google profile picture
//             isAccountVerified: true, // Google OAuth users are automatically verified
//           });
//         } else if (!user.googleId) {
//           // Link Google account to existing user
//           user.googleId = profile.id;
//           user.isAccountVerified = true;
//           await user.save();
//         }

//         console.log("Google OAuth User:", user); // Debugging
//         done(null, user); // Attach user to the session
//       } catch (err) {
//         console.error("Google OAuth Error:", err); // Debugging
//         done(err);
//       }
//     }
//   )
// );

// // Serialize the user into the session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize the user from the session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await userModel.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });


app.get('/', (req, res) => {
  res.send("API Working");
});

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// app.use('/auth', oauthRouter);
app.use("/api/vendors", vendorRoutes);  // All vendor routes will be prefixed with /api/vendors


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

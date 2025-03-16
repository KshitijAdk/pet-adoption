import express from 'express';
import connectDB from './db.js';  // Import the DB connection
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js'
import petRoutes from './routes/petRoutes.js'
import adoptionRoutes from './routes/adoptionRoutes.js'
// import session from 'express-session';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import passport from 'passport';
// import oauthRouter from './routes/oauthRoutes.js';
// import userModel from './models/userModel.js';

import Vendor from './models/Vendor.js';

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
app.use("/api/pets", petRoutes); // Mount pet routes
app.use("/api/adoption", adoptionRoutes); // Mount pet routes



app.get('/api/pets/:vendorId/pets', async (req, res) => {
  const { vendorId } = req.params;
  console.log(`Querying for vendor with vendorId: ${vendorId}`);

  try {
    // Query the Vendor collection directly by vendorId
    const vendor = await Vendor.findOne({ _id: vendorId });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Return the pets associated with the vendor
    res.status(200).json({ pets: vendor.pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// API to get pet details by petId and vendorId
app.get("/api/vendors/pet-details/:vendorId/:petId", async (req, res) => {
  const { vendorId, petId } = req.params;

  try {
    // Find the vendor by vendorId
    const vendor = await Vendor.findById(vendorId).populate('pets').populate('adoptionRequests');

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Find the pet by petId inside the vendor's pets array
    const pet = vendor.pets.find((pet) => pet._id.toString() === petId);

    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    // Return the full details of the vendor and the pet
    return res.status(200).json({
      success: true,
      vendor: {
        organization: vendor.organization,
        address: vendor.address,
      },
      pet: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        size: pet.size,
        weight: pet.weight,
        gender: pet.gender,
        health: pet.health,
        goodWith: pet.goodWith,
        traits: pet.traits,
        imageUrl: pet.imageUrl,
        description: pet.description,
        status: pet.status,
        createdAt: pet.createdAt
      }
    });
  } catch (error) {
    console.error("Error retrieving vendor or pet:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

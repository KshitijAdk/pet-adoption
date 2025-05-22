import { createBlog, getAllBlogs } from "../controllers/blogController.js";

import express from "express";

const router = express.Router();
// Route to create a new blog post  
router.post("/create", createBlog);
// Route to get all blog posts
router.get("/", getAllBlogs);
// Export the router to be used in other parts of the application
export default router;
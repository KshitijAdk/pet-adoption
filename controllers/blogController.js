import Blog from "../models/blogs.model.js";

// Function to create a new blog post
export const createBlog = async (req, res) => {
    try {
        const { title, content, image, category } = req.body;

        // Validate the request body
        if (!title || !content || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new blog post
        const newBlog = new Blog({
            title,
            content,
            image,
            category,
        });

        // Save the blog post to the database
        await newBlog.save();

        // Return the created blog post
        return res.status(201).json(newBlog);
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to get all blog posts
export const getAllBlogs = async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const blogs = await Blog.find();

        // Return the list of blog posts
        return res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
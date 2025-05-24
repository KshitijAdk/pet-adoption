import mongoose from "mongoose";

// Define the schema for the blog posts
// This schema includes fields for title, content, image, and category

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        author: {
            type: String,
            required: [true, "Author is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Create the model from the schema
const Blog = mongoose.model("Blog", blogSchema);
// Export the model for use in other parts of the application
export default Blog;
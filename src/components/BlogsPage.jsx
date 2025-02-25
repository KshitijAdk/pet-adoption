import { useState } from "react";
import { Dog, Newspaper } from "lucide-react";

const blogs = [
    {
        id: 1,
        title: "The Joy of Adopting a Pet",
        image: "https://source.unsplash.com/400x250/?dog,cat",
        description: "Adopting a pet is a life-changing decision that brings joy, love, and responsibility...",
    },
    {
        id: 2,
        title: "How to Prepare Your Home for a New Pet",
        image: "https://source.unsplash.com/400x250/?pet,home",
        description: "Bringing a new pet home? Here are some essential tips to create a pet-friendly environment...",
    },
    {
        id: 3,
        title: "Top 5 Reasons to Adopt Instead of Buy",
        image: "https://source.unsplash.com/400x250/?rescue,dog",
        description: "Why should you adopt a pet rather than buy one? Let's explore the top 5 reasons...",
    },
    {
        id: 4,
        title: "Caring for Your Adopted Pet",
        image: "https://source.unsplash.com/400x250/?cat,dog",
        description: "Once you've adopted a pet, it's important to provide the best care possible. Here are some tips...",
    },
];

export default function BlogPage() {
    const [expandedBlog, setExpandedBlog] = useState(null);

    return (
        <div className="bg-purple-200 min-h-screen w-full bg-image-login">
            <div className="max-w-6xl mx-auto p-6">
                {/* Hero Section */}
                <div className="flex items-center bg-gradient-to-r from-gray-300 to-purple-200 rounded-lg p-6 mb-6 shadow-lg">
                    <Dog className="w-20 h-20 text-purple-800" />
                    <div className="ml-6">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome to the Pet Adoption Blog</h1>
                        <p className="text-gray-600">The latest news and updates</p>
                        <p className="mt-2 text-gray-700">
                            Welcome to the Pet Adoption blog! Here you'll find all the latest news and updates about our furry friends.
                            From heartwarming adoption stories to tips on pet care, we've got it all. Be sure to check back regularly for new posts,
                            and don’t forget to share your favorite articles with your fellow animal lovers!
                        </p>
                    </div>
                </div>

                {/* Blogs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 hover:shadow-xl transition"
                        >
                            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-md" />
                            <h2 className="text-xl font-semibold mt-4 text-purple-800 flex items-center">
                                <Newspaper className="w-5 h-5 mr-2 text-purple-600" />
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {expandedBlog === blog.id ? blog.description : `${blog.description.substring(0, 60)}...`}
                            </p>
                            <button
                                className="mt-3 text-purple-500 hover:underline"
                                onClick={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
                            >
                                {expandedBlog === blog.id ? "Show Less" : "Read More"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import { Dog, Newspaper, Heart, Share2, BookOpen, ChevronRight, Search } from "lucide-react";
import AnimateOnScroll, { AnimatedChild } from "../components/ui/AnimateOnScroll";

const blogs = [
    {
        id: 1,
        title: "The Joy of Adopting a Pet",
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        description: "Adopting a pet is a life-changing decision that brings joy, love, and responsibility. When you choose to adopt, you're not just gaining a pet – you're saving a life and gaining a loyal companion who will fill your days with unconditional love and endless moments of happiness...",
        author: "Sarah Johnson",
        date: "March 15, 2024",
        readTime: "5 min read",
        category: "Adoption Stories"
    },
    {
        id: 2,
        title: "How to Prepare Your Home for a New Pet",
        image: "https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        description: "Bringing a new pet home? Here are some essential tips to create a pet-friendly environment. From securing dangerous items to setting up comfortable spaces, this guide will help you ensure your home is ready to welcome its newest family member...",
        author: "Mike Peters",
        date: "March 14, 2024",
        readTime: "4 min read",
        category: "Pet Care"
    },
    {
        id: 3,
        title: "Top 5 Reasons to Adopt Instead of Buy",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        description: "Why should you adopt a pet rather than buy one? Let's explore the top 5 compelling reasons that make adoption the better choice. From saving lives to fighting puppy mills, discover how your decision to adopt can make a real difference in the world of animal welfare...",
        author: "Emma Wilson",
        date: "March 13, 2024",
        readTime: "6 min read",
        category: "Adoption Guide"
    },
    {
        id: 4,
        title: "Caring for Your Adopted Pet",
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        description: "Once you've adopted a pet, it's important to provide the best care possible. From nutrition to exercise, medical care to training, here are comprehensive tips to ensure your new family member thrives in their forever home...",
        author: "Dr. James Carter",
        date: "March 12, 2024",
        readTime: "7 min read",
        category: "Pet Health"
    },
];

const categories = ["All Posts", "Adoption Stories", "Pet Care", "Health Tips", "Success Stories"];

export default function BlogPage() {
    const [expandedBlog, setExpandedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Dogs and cats"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">Paws & Tales Blog</h1>
                            <p className="text-xl md:text-2xl text-purple-100 mb-8">
                                Stories, tips, and insights about pet adoption and care
                            </p>
                            <div className="relative max-w-2xl mx-auto">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70" />
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className="px-6 py-3 rounded-full bg-purple-50 hover:bg-purple-100 transition-all duration-300 text-purple-700 text-sm font-medium"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {blogs.map((blog) => (
                            <AnimatedChild key={blog.id}>
                                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            <span>{blog.readTime}</span>
                                            <span className="mx-2">•</span>
                                            <span>{blog.date}</span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-purple-600 transition-colors">
                                            {blog.title}
                                        </h2>

                                        <p className="text-gray-600 mb-6 line-clamp-3">
                                            {expandedBlog === blog.id
                                                ? blog.description
                                                : blog.description.substring(0, 150) + "..."}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
                                                className="text-purple-600 hover:text-purple-700 font-medium flex items-center group"
                                            >
                                                {expandedBlog === blog.id ? "Show Less" : "Read More"}
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            <div className="flex space-x-4">
                                                <button className="text-gray-400 hover:text-purple-600 transition-colors">
                                                    <Heart className="w-5 h-5" />
                                                </button>
                                                <button className="text-gray-400 hover:text-purple-600 transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </AnimatedChild>
                        ))}
                    </AnimateOnScroll>
                </div>
            </section>
        </div>
    );
}
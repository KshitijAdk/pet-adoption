import { useState, useEffect } from "react";
import { Newspaper, Search } from "lucide-react";
import AnimateOnScroll from "./ui/AnimateOnScroll";
import BlogCard from "./ui/BlogCard";

const categories = ["All Posts", "Adoption Stories", "Pet Care", "Health Tips", "Success Stories"];

export default function BlogPage() {
    const [expandedBlog, setExpandedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All Posts");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/blogs/');
                if (!response.ok) throw new Error('Failed to fetch blogs');
                const data = await response.json();
                setBlogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        activeCategory === "All Posts" || blog.category === activeCategory
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-amber-800">Loading blogs...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto border border-amber-100">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading blogs</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-amber-600 to-amber-800 text-white py-16 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm"></div>
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Pets"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <AnimateOnScroll animation="fadeIn">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Paws & Tales</h1>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                            Heartwarming stories and practical advice for pet lovers
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {filteredBlogs.length === 0 ? (
                        <div className="text-center py-12">
                            <Newspaper className="w-12 h-12 mx-auto text-amber-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700">No articles found</h3>
                            <p className="text-gray-500 mt-2">Try selecting a different category</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    expandedBlog={expandedBlog}
                                    setExpandedBlog={setExpandedBlog}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
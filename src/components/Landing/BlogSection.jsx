import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimateOnScroll from '../ui/AnimateOnScroll';
import BlogCard from '../ui/BlogCard';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/blogs/');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        // Sort by createdAt (newest first) and take the first 3
        const sortedBlogs = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setBlogs(sortedBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-800">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
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
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest From Our Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tips, stories, and updates from the world of pet adoption and animal welfare.</p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll staggerChildren={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  _id: blog._id,
                  title: blog.title,
                  createdAt: blog.createdAt,
                  category: blog.category,
                  content: blog.content,
                  image: blog.image,
                  author: blog.author || 'Unknown', // Fallback for author
                  link: blog.link || '#', // Fallback for link
                }}
                formatDate={formatDate}
              />
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp" delay={0.3}>
          <div className="text-center mt-10">
            <a href="/fullblogs" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold">
              View All Blog Posts <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default BlogSection;
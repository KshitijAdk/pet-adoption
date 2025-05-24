import { User, ChevronRight } from "lucide-react";
import { AnimatedChild } from "./AnimateOnScroll";

const BlogCard = ({ blog, expandedBlog, setExpandedBlog, formatDate }) => {
    return (
        <AnimatedChild>
            <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-50">
                <div className="h-48 overflow-hidden">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <div className="p-5">
                    <div className="flex items-center text-xs text-amber-600 mb-3">
                        <span className="bg-amber-100 px-2 py-1 rounded">
                            {blog.category}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {expandedBlog === blog._id
                            ? blog.content
                            : `${blog.content.substring(0, 120)}...`}
                    </p>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setExpandedBlog(expandedBlog === blog._id ? null : blog._id)}
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
                        >
                            {expandedBlog === blog._id ? "Show less" : "Read more"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                        <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center space-x-2 text-amber-700">
                                <User className="w-4 h-4 text-amber-600" />
                                <span>By {blog.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </AnimatedChild>
    );
};

export default BlogCard;
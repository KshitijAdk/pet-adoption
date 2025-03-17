import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from '../ui/AnimateOnScroll';

const blogPosts = [
  {
    title: '10 Essential Tips for New Pet Parents',
    date: 'May 15, 2025',
    category: 'Pet Care',
    description: 'Bringing a new pet home is exciting but can also be overwhelming. Here are our top tips to help you and your new companion adjust.',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    link: '#',
  },
  {
    title: "Understanding Your Pet's Vaccination Schedule",
    date: 'April 28, 2025',
    category: 'Health',
    description: "Keeping up with your pet's vaccinations is crucial for their health. Learn about the essential vaccines and when they're needed.",
    imageUrl: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    link: '#',
  },
  {
    title: "From Shelter to Sofa: Bella's Journey Home",
    date: 'April 10, 2025',
    category: 'Success Stories',
    description: 'After two years in our shelter, Bella finally found her forever family. Read about her heartwarming adoption story.',
    imageUrl: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    link: '#',
  },
];

const BlogSection = () => {
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
            {blogPosts.map((post, index) => (
              <AnimatedChild key={index} animation="fadeInUp">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">{post.date} • {post.category}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    <a href={post.link} className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center">
                      Read More <ChevronRight className="ml-1 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </AnimatedChild>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp" delay={0.3}>
          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold">
              View All Blog Posts <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default BlogSection;
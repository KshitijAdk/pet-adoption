import React from 'react';
import { Heart, Info, Users, MessageSquare } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from "../ui/AnimateOnScroll";
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-8 lg:px-12"> {/* Increased horizontal padding */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <AnimateOnScroll animation="slideInLeft" className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Adopt a pet"
              className="rounded-xl shadow-lg w-full"
            />
          </AnimateOnScroll>

          <div className="lg:w-1/2">
            <AnimateOnScroll animation="slideInRight">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">About Our Mission</h2> {/* Smaller heading */}
              <p className="text-gray-600 mb-4 text-sm md:text-base"> {/* Smaller text */}
                NayaSathi is an online platform built to connect potential adopters with pet vendors and shelters. Our goal is to make pet adoption easier, transparent, and more accessible for everyone.
              </p>
              <p className="text-gray-600 mb-6 text-sm md:text-base"> {/* Smaller text */}
                From verified vendor applications to adoption request tracking, we streamline the adoption process for both pet seekers and providers.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll staggerChildren={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"> {/* Increased bottom margin */}
                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3"> {/* Smaller icon container */}
                      <Heart className="h-4 w-4 text-amber-600" /> {/* Smaller icon */}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Adopt with Love</h3> {/* Smaller heading */}
                      <p className="text-xs text-gray-600">Find pets looking for a second chance at happiness.</p> {/* Smaller text */}
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Info className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Verified Vendors</h3>
                      <p className="text-xs text-gray-600">We manually review and approve vendor applications.</p>
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Easy Applications</h3>
                      <p className="text-xs text-gray-600">Apply to adopt with just a few clicks.</p>
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Real-time Updates</h3>
                      <p className="text-xs text-gray-600">Track adoption status and connect with vendors.</p>
                    </div>
                  </div>
                </AnimatedChild>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeInUp" delay={0.3}>
              <Link to="/aboutUs">
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-5 rounded-full transition duration-300 text-sm md:text-base"> {/* Smaller button */}
                  Learn More
                </button>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
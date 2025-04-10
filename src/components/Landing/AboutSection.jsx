import React from 'react';
import { Heart, Info, Users, MessageSquare } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from "../ui/AnimateOnScroll"
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <AnimateOnScroll animation="slideInLeft" className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="People with pets"
              className="rounded-xl shadow-lg"
            />
          </AnimateOnScroll>

          <div className="lg:w-1/2">
            <AnimateOnScroll animation="slideInRight">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Our Mission</h2>
              <p className="text-gray-600 mb-6">Founded in 2018, PawsAndHearts is dedicated to finding loving homes for abandoned and rescued animals. We believe every pet deserves a second chance at happiness.</p>
              <p className="text-gray-600 mb-8">Our network of shelters and foster homes works tirelessly to rehabilitate, care for, and match pets with their perfect forever families. We've successfully placed over 10,000 animals in loving homes across the country.</p>
            </AnimateOnScroll>

            <AnimateOnScroll staggerChildren={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Heart className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">No-Kill Policy</h3>
                      <p className="text-sm text-gray-600">We never euthanize healthy, adoptable animals.</p>
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Info className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Thorough Vetting</h3>
                      <p className="text-sm text-gray-600">All pets receive complete medical care before adoption.</p>
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Users className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Adoption Counseling</h3>
                      <p className="text-sm text-gray-600">We help match the right pet with the right family.</p>
                    </div>
                  </div>
                </AnimatedChild>

                <AnimatedChild>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <MessageSquare className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Lifetime Support</h3>
                      <p className="text-sm text-gray-600">We're here for you and your pet for life.</p>
                    </div>
                  </div>
                </AnimatedChild>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fadeInUp" delay={0.3}>
              <Link to="/aboutUs">
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
                  Learn More About Us
                </button>
              </Link>

            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
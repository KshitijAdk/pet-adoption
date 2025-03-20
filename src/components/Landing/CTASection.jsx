import React from 'react';
import AnimateOnScroll, { AnimatedChild } from '../ui/AnimateOnScroll';

const CTASection = () => {
  return (
    <section className="py-16 bg-amber-500">
      <div className="container mx-auto px-6 text-center">
        <AnimateOnScroll animation="fadeInUp" staggerChildren={0.2}>
          <AnimatedChild>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Change a Life?</h2>
          </AnimatedChild>

          <AnimatedChild animation="fadeIn" duration={0.7}>
            <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
              Your new best friend is waiting. Start your adoption journey today and bring home a lifetime of love and companionship.
            </p>
          </AnimatedChild>

          <AnimatedChild animation="scaleUp">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white hover:bg-gray-100 text-amber-600 font-semibold py-3 px-8 rounded-full transition duration-300">
                Find Your Pet
              </button>
              <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-semibold py-3 px-8 rounded-full transition duration-300">
                Donate to Help
              </button>
            </div>
          </AnimatedChild>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default CTASection;
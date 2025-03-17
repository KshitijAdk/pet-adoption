import { Heart, PawPrint, Users } from "lucide-react";
import AnimateOnScroll, { AnimatedChild } from "../ui/AnimateOnScroll"

const StatsSection = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6">
        <AnimateOnScroll staggerChildren={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedChild>
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">500+</h3>
                <p className="text-gray-600">Pets Adopted</p>
              </div>
            </AnimatedChild>
            
            <AnimatedChild>
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <PawPrint className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">50+</h3>
                <p className="text-gray-600">Partner Shelters</p>
              </div>
            </AnimatedChild>
            
            <AnimatedChild>
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">10k+</h3>
                <p className="text-gray-600">Happy Families</p>
              </div>
            </AnimatedChild>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default StatsSection;
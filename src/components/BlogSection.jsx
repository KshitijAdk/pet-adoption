import React from "react";
import img1 from '../assests/home.png'
import img2 from '../assests/pets.png'

const BlogSection = () => {
  return (
    <div className="bg-purple-100 py-16 bg-image-login">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-black-800 mb-12">
          Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={img1}
              alt="Dog"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-purple-800">
                Blog Title [Dog Adoption Blogs]
              </h3>
              <p className="text-purple-600 mt-2">
                Read blogs about caring for your Dog.
              </p>
              <button className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">
                Read More
              </button>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={img2}
              alt="Cat"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-purple-800">
                Blog Title [Cat Adoption Blogs]
              </h3>
              <p className="text-purple-600 mt-2">
                Read blogs about caring for your Cat.
              </p>
              <button className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
import React from 'react';
import { PawPrint, Heart, Phone, Info, Users, MessageSquare, ChevronRight } from 'lucide-react';

const services = [
  {
    title: 'Adoption Services',
    description: 'Find your perfect companion through our thorough matching process designed to ensure lifelong happiness for both pets and owners.',
    icon: <PawPrint className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
  {
    title: 'Foster Programs',
    description: 'Temporarily open your home to a pet in need. Our foster program provides crucial care for animals awaiting their forever homes.',
    icon: <Heart className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
  {
    title: 'Behavioral Support',
    description: 'Access professional advice and training resources to help your new pet adjust to their home and address any behavioral challenges.',
    icon: <Phone className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
  {
    title: 'Educational Resources',
    description: 'Access our library of articles, videos, and workshops on pet care, training, nutrition, and health to be the best pet parent possible.',
    icon: <Info className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
  {
    title: 'Community Events',
    description: 'Join our adoption fairs, fundraisers, and pet-friendly gatherings to connect with fellow animal lovers and support our cause.',
    icon: <Users className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
  {
    title: 'Volunteer Opportunities',
    description: 'Make a difference in the lives of animals by volunteering your time and skills at our shelters, events, or administrative offices.',
    icon: <MessageSquare className="h-8 w-8 text-amber-600" />,
    link: '#',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We offer a range of services to help pets and their owners live their best lives together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-amber-100 p-4 rounded-full inline-block mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <a href={service.link} className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center">
                Learn More <ChevronRight className="ml-1 h-5 w-5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

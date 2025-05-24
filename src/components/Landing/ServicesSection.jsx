import React from 'react';
import { PawPrint, Heart, Phone, Info, Users, MessageSquare, ChevronRight } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from '../ui/AnimateOnScroll'

const services = [
  {
    title: 'Pet Adoption',
    description: 'Browse and adopt pets lovingly cared for by verified vendors, helping you find your new furry family member.',
    icon: <PawPrint className="h-7 w-7 text-amber-600" />,
    link: '/adoption',
  },
  {
    title: 'Vendor Registration',
    description: 'Apply to become a trusted vendor and list pets available for adoption to connect with responsible pet owners.',
    icon: <Users className="h-7 w-7 text-amber-600" />,
    link: '/vendor-registration',
  },
  {
    title: 'Adoption Requests Management',
    description: 'Easily manage and track adoption requests through your vendor dashboard for smooth communication and approvals.',
    icon: <MessageSquare className="h-7 w-7 text-amber-600" />,
    link: '/vendor/adoption-requests',
  },
  {
    title: 'Pet Care Resources',
    description: 'Explore articles and guides on pet health, nutrition, and behavior to ensure a happy and healthy companion.',
    icon: <Info className="h-7 w-7 text-amber-600" />,
    link: '/resources',
  },
  {
    title: 'Community Support',
    description: 'Join community events and forums to share experiences, ask questions, and connect with fellow pet lovers.',
    icon: <Heart className="h-7 w-7 text-amber-600" />,
    link: '/community',
  },
  {
    title: 'Volunteer & Donate',
    description: 'Contribute your time or resources to support shelters and pet welfare initiatives featured on NayaSathi.',
    icon: <Phone className="h-7 w-7 text-amber-600" />,
    link: '/volunteer',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-16">
        <AnimateOnScroll animation="fadeInUp">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
              NayaSathi offers a variety of services to support pet adoption, vendors, and the pet-loving community.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll staggerChildren={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {services.map((service, index) => (
              <AnimatedChild key={index} animation="scaleUp">
                <div className="bg-white p-7 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 w-80 h-72 flex flex-col justify-between">
                  <div>
                    <div className="bg-amber-100 p-3 rounded-full inline-block mb-5">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>
              </AnimatedChild>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ServicesSection;

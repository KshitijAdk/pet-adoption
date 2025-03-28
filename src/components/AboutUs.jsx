import React from 'react';
import { Heart, Info, Users, MessageSquare, Star, Trophy, PawPrint, Calendar, Phone, Mail, MapPin, Home } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from "../components/ui/AnimateOnScroll"

const stats = [
    { number: "10,000+", label: "Pets Adopted", icon: <PawPrint className="h-6 w-6" /> },
    { number: "500+", label: "Active Volunteers", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Partner Shelters", icon: <Home className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-6 w-6" /> },
];

const team = [
    {
        name: "Dr. Sarah Johnson",
        role: "Founder & Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        quote: "Every animal deserves a loving home, and we're here to make that happen."
    },
    {
        name: "Michael Chen",
        role: "Head Veterinarian",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        quote: "Quality medical care is essential for every pet's well-being."
    },
    {
        name: "Emma Williams",
        role: "Adoption Coordinator",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        quote: "Finding the perfect match between pets and families is our priority."
    }
];

const timeline = [
    {
        year: "2018",
        title: "Foundation",
        description: "PawsAndHearts was established with a mission to save abandoned pets."
    },
    {
        year: "2019",
        title: "First Shelter",
        description: "Opened our first dedicated shelter facility with modern amenities."
    },
    {
        year: "2020",
        title: "Network Growth",
        description: "Expanded to partner with 20+ local shelters across the region."
    },
    {
        year: "2021",
        title: "Medical Center",
        description: "Launched our in-house veterinary medical center."
    },
    {
        year: "2022",
        title: "Digital Platform",
        description: "Introduced our online adoption platform for easier pet matching."
    },
    {
        year: "2023",
        title: "National Expansion",
        description: "Extended operations to cover multiple states across the country."
    }
];

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-amber-600 to-amber-800 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Dogs and cats"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
                        <p className="text-xl md:text-2xl max-w-2xl text-amber-100">
                            Dedicated to creating happy endings for pets and families since 2018
                        </p>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Mission Section */}
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
                                <p className="text-gray-600 mb-6">
                                    Founded in 2018, PawsAndHearts is dedicated to finding loving homes for abandoned and rescued animals.
                                    We believe every pet deserves a second chance at happiness.
                                </p>
                                <p className="text-gray-600 mb-8">
                                    Our network of shelters and foster homes works tirelessly to rehabilitate, care for, and match pets
                                    with their perfect forever families. We've successfully placed over 10,000 animals in loving homes
                                    across the country.
                                </p>
                            </AnimateOnScroll>

                            <AnimateOnScroll staggerChildren={0.1}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Features grid from AboutSection component */}
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <AnimatedChild key={index} className="text-center">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                                        <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            {React.cloneElement(stat.icon, { className: "text-amber-600" })}
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                                        <p className="text-gray-600">{stat.label}</p>
                                    </div>
                                </AnimatedChild>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <AnimatedChild key={index}>
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                                        />
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                        <p className="text-amber-600 mb-4">{member.role}</p>
                                        <p className="text-gray-600 italic">"{member.quote}"</p>
                                    </div>
                                </AnimatedChild>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Our Journey</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200"></div>
                            <div className="space-y-12">
                                {timeline.map((event, index) => (
                                    <AnimatedChild key={index} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                                        <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12'}`}>
                                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                                <h3 className="text-2xl font-bold text-amber-600 mb-2">{event.year}</h3>
                                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h4>
                                                <p className="text-gray-600">{event.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white shadow"></div>
                                    </AnimatedChild>
                                ))}
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                            <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                { icon: <Phone className="h-6 w-6" />, title: "Call Us", info: "(555) 123-4567" },
                                { icon: <Mail className="h-6 w-6" />, title: "Email", info: "contact@pawsandhearts.com" },
                                { icon: <MapPin className="h-6 w-6" />, title: "Visit", info: "123 Pet Street, Animal City, AC 12345" }
                            ].map((contact, index) => (
                                <AnimatedChild key={index}>
                                    <div className="bg-amber-50 rounded-2xl p-6 text-center">
                                        <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            {React.cloneElement(contact.icon, { className: "text-amber-600" })}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{contact.title}</h3>
                                        <p className="text-gray-600">{contact.info}</p>
                                    </div>
                                </AnimatedChild>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>
        </div>
    );
}
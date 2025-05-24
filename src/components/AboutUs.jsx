import React from 'react';
import { Heart, Info, Users, MessageSquare, Star, Trophy, PawPrint, Calendar, Phone, Mail, MapPin, Home } from 'lucide-react';
import AnimateOnScroll, { AnimatedChild } from "../components/ui/AnimateOnScroll"
import image from '../assests/kshitij.jpg';

const stats = [
    { number: "10k+", label: "Pets Adopted", icon: <PawPrint className="h-5 w-5" /> },
    { number: "500+", label: "Volunteers", icon: <Users className="h-5 w-5" /> },
    { number: "50+", label: "Shelters", icon: <Home className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-5 w-5" /> },
];

const team = [

    {
        name: "Kshitij Adhikari",
        role: "Founder and Developer",
        image: image,
        quote: "Empowering pet adoption through technology.",
    },

];

const timeline = [
    { year: "2023", title: "Project Initiation", description: "Started development of NayaSathi – a pet adoption platform." },
    { year: "2024", title: "Core Feature Development", description: "Implemented vendor registration, pet listing, user authentication, and adoption management modules." },
    { year: "2025", title: "System Completion & Expansion", description: "Integrated admin controls, document verification, and prepared the system for deployment and future enhancements." }
];


export default function AboutUs() {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100">
            {/* Hero Section - More compact */}
            <section className="relative bg-gradient-to-r from-amber-600 to-amber-800 text-white py-16">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Dogs and cats"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative container mx-auto px-4 max-w-5xl">
                    <AnimateOnScroll animation="fadeIn">
                        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
                        <p className="text-xl max-w-2xl text-amber-100">
                            Dedicated to creating happy endings for pets and families since 2018
                        </p>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Mission Section - More concise */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <AnimateOnScroll animation="slideInLeft" className="lg:w-2/5">
                            <img
                                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="People with pets"
                                className="rounded-lg shadow-md"
                            />
                        </AnimateOnScroll>

                        <div className="lg:w-3/5">
                            <AnimateOnScroll animation="slideInRight">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Mission</h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    NayaSathi is an online platform built to connect potential adopters with pet vendors and shelters.
                                    Our goal is to make pet adoption easier, transparent, and more accessible for everyone.
                                </p>
                                <p className="text-gray-600 text-sm mb-6">
                                    From verified vendor applications to adoption request tracking,
                                    we streamline the adoption process for both pet seekers and providers.
                                </p>
                            </AnimateOnScroll>

                            <AnimateOnScroll staggerChildren={0.1}>
                                <div className="grid grid-cols-2 gap-3">
                                    <AnimatedChild>
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                                                <Heart className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">No-Kill Policy</h3>
                                                <p className="text-xs text-gray-600">We never euthanize healthy pets.</p>
                                            </div>
                                        </div>
                                    </AnimatedChild>

                                    <AnimatedChild>
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                                                <Info className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">Thorough Vetting</h3>
                                                <p className="text-xs text-gray-600">Complete medical care before adoption.</p>
                                            </div>
                                        </div>
                                    </AnimatedChild>

                                    <AnimatedChild>
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                                                <Users className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">Adoption Counseling</h3>
                                                <p className="text-xs text-gray-600">Finding perfect pet-family matches.</p>
                                            </div>
                                        </div>
                                    </AnimatedChild>

                                    <AnimatedChild>
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                                                <MessageSquare className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-sm">Lifetime Support</h3>
                                                <p className="text-xs text-gray-600">We're here for you and your pet.</p>
                                            </div>
                                        </div>
                                    </AnimatedChild>
                                </div>
                            </AnimateOnScroll>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - More compact */}
            <section className="py-10 bg-amber-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <AnimatedChild key={index} className="text-center">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            {React.cloneElement(stat.icon, { className: "text-amber-600" })}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</h3>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                </AnimatedChild>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Team Section - More compact */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <AnimateOnScroll animation="fadeIn">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Meet Our Team</h2>
                        <div className={`gap-6 ${team.length === 1 ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-3"}`}>
                            {team.map((member, index) => (
                                <AnimatedChild key={index}>
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center mx-auto">
                                        {/* member content */}
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-white shadow-md"
                                        />
                                        <h3 className="text-lg font-bold text-gray-800 mb-0.5">{member.name}</h3>
                                        <p className="text-amber-600 text-sm mb-2">{member.role}</p>
                                        <p className="text-gray-600 italic text-sm">"{member.quote}"</p>
                                    </div>
                                </AnimatedChild>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>


            {/* Timeline Section - More compact */}
            <section className="py-12 bg-amber-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <AnimateOnScroll animation="fadeIn">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Journey</h2>
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-amber-200"></div>
                            <div className="space-y-8">
                                {timeline.map((event, index) => (
                                    <AnimatedChild key={index} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                                        <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 text-right' : 'md:pl-8'}`}>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <h3 className="text-lg font-bold text-amber-600 mb-1">{event.year}</h3>
                                                <h4 className="text-md font-semibold text-gray-800 mb-1">{event.title}</h4>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow"></div>
                                    </AnimatedChild>
                                ))}
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Contact Section - More compact */}
            <section className="py-10 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <AnimateOnScroll animation="fadeIn">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h2>
                            <p className="text-sm text-gray-600">Have questions? We'd love to hear from you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            {[
                                { icon: <Phone className="h-5 w-5" />, title: "Call Us", info: "(555) 123-4567" },
                                { icon: <Mail className="h-5 w-5" />, title: "Email", info: "contact@pawsandhearts.com" },
                                { icon: <MapPin className="h-5 w-5" />, title: "Visit", info: "123 Pet Street, Animal City" }
                            ].map((contact, index) => (
                                <AnimatedChild key={index}>
                                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                                        <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            {React.cloneElement(contact.icon, { className: "text-amber-600" })}
                                        </div>
                                        <h3 className="text-md font-semibold text-gray-800 mb-1">{contact.title}</h3>
                                        <p className="text-sm text-gray-600">{contact.info}</p>
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
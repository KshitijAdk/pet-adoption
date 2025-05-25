import React from "react";
import { Facebook, Twitter, Instagram, MessageCircle, Heart, PawPrint, MapPin, Clock, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <PawPrint className="text-amber-400 mr-2" size={24} />
                            <h3 className="text-xl font-bold">NayaSathi</h3>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Connecting loving homes with pets in need. Our mission is to reduce animal homelessness through adoption, education, and community support.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-amber-600 transition">
                                <Facebook size={18} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-amber-600 transition">
                                <Twitter size={18} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-amber-600 transition">
                                <Instagram size={18} />
                            </a>
                            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-amber-600 transition">
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="/pets" className="flex items-center hover:text-amber-400 transition">
                                    <Heart className="mr-2" size={16} />
                                    Adopt a Pet
                                </a>
                            </li>
                            <li>
                                <a href="/our-partner-organizations" className="flex items-center hover:text-amber-400 transition">
                                    <Heart className="mr-2" size={16} />
                                    Organizations
                                </a>
                            </li>
                            <li>
                                <a href="/our-partner-organizations" className="flex items-center hover:text-amber-400 transition">
                                    <Heart className="mr-2" size={16} />
                                    Donate
                                </a>
                            </li>
                            <li>
                                <a href="/fullblogs" className="flex items-center hover:text-amber-400 transition">
                                    <Heart className="mr-2" size={16} />
                                    Success Stories
                                </a>
                            </li>
                            <li>
                                <a href="/fullblogs" className="flex items-center hover:text-amber-400 transition">
                                    <Heart className="mr-2" size={16} />
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Contact Info</h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-start">
                                <MapPin className="mr-2 mt-1 flex-shrink-0" size={16} />
                                <p>123 Pet Avenue, Kathmandu, Nepal</p>
                            </div>
                            <div className="flex items-center">
                                <Mail className="mr-2" size={16} />
                                <a href="mailto:info@nayasathi.com" className="hover:text-amber-400 transition">info@nayasathi.com</a>
                            </div>
                            <div className="flex items-center">
                                <MessageCircle className="mr-2" size={16} />
                                <a href="tel:+9771234567890" className="hover:text-amber-400 transition">+977 123-456-7890</a>
                            </div>
                            <div className="flex items-start">
                                <Clock className="mr-2 mt-1 flex-shrink-0" size={16} />
                                <p>Mon-Sat: 9:00 AM - 5:00 PM<br />Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Newsletter</h3>
                        <p className="text-gray-300 text-sm">
                            Subscribe to our newsletter to get updates on new pets, events, and pet care tips.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-amber-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition w-full"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 NayaSathi. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
                        <a href="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
                        <a href="/faq" className="text-gray-400 hover:text-white text-sm transition">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
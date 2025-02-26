import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";
import { AppContent } from "../context/AppContext";

const Footer = () => {
    const navigate = useNavigate();
    const { isLoggedin } = useContext(AppContent); // Get isLoggedin from context

    const handleVendorClick = () => {
        if (!isLoggedin) {
            // If not logged in, redirect to login page
            navigate("/login");
        } else {
            navigate('/vendor-registration')
        }
    };

    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                {/* Contact Section */}
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold">Contact Us</h3>
                    <p className="flex items-center justify-center md:justify-start mt-2">
                        <span className="mr-2">📞</span> +1 123-456-7890
                    </p>
                    <p className="flex items-center justify-center md:justify-start mt-1">
                        <span className="mr-2">✉️</span> info@nayasathi.com
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="text-center mb-6 md:mb-0">
                    <ul className="flex space-x-6 text-sm">
                        <li>
                            <a href="/" className="hover:text-purple-400">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="hover:text-purple-400">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="#adopt" className="hover:text-purple-400">
                                Adopt a Pet
                            </a>
                        </li>
                        <li>
                            <a href="#events" className="hover:text-purple-400">
                                Events
                            </a>
                        </li>
                        <li>
                            <a href="#contact" className="hover:text-purple-400">
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a
                                href=""
                                className="hover:text-purple-400"
                                onClick={handleVendorClick} // Use the handleVendorClick function here
                            >
                                Apply Vendor
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-4 justify-center">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer">
                        <Facebook className="text-white hover:text-purple-400" size={20} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer">
                        <Twitter className="text-white hover:text-purple-400" size={20} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">
                        <Instagram className="text-white hover:text-purple-400" size={20} />
                    </a>
                    <a href="https://whatsapp.com" target="_blank" rel="noreferrer">
                        <MessageCircle className="text-white hover:text-purple-400" size={20} />
                    </a>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="text-center text-sm text-gray-400 mt-6">
                © 2025 NayaSathi. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is NayaSathi?",
            answer:
                "NayaSathi is a pet adoption platform that connects rescue organizations and foster families with individuals looking to adopt a pet. Our goal is to provide a seamless adoption process while promoting responsible pet ownership.\n\nWe collaborate with shelters and rescuers to ensure every pet finds a loving forever home."
        },
        {
            question: "How does the pet adoption process work on NayaSathi?",
            answer:
                "The process begins with browsing available pets on our platform. Once you find a pet you're interested in, you can fill out an adoption application. The respective rescue organization will then review your application and guide you through the next steps, including a home check and meeting the pet."
        },
        {
            question: "Are there any adoption fees?",
            answer:
                "Yes, adoption fees are determined by the rescue organization and vary depending on the pet. These fees cover vaccinations, spaying/neutering, and other medical expenses incurred during the pet's care."
        },
        {
            question: "What support does NayaSathi offer after adoption?",
            answer:
                "NayaSathi provides resources such as pet care guides, access to training tips, and a community forum where adopters can share their experiences and seek advice. Additionally, we connect you with local veterinary services for ongoing pet care."
        },
        {
            question: "How can I become a volunteer with NayaSathi?",
            answer:
                "You can join our mission by signing up as a volunteer through our platform. Volunteers assist in various roles, including fostering pets, helping with events, and spreading awareness about adoption."
        },
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to format answer text with paragraphs
    const formatAnswer = (text) => {
        return text.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
                {paragraph}
            </p>
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-800 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get answers to the most common questions about pet adoption at NayaSathi.
                        If you can't find what you're looking for, feel free to contact us.
                    </p>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-5">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex justify-between items-center w-full p-5 text-left"
                                    aria-expanded={openIndex === index}
                                >
                                    <div className="flex items-center">
                                        <HelpCircle className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                                        <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                                    </div>
                                    <div className={`h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index
                                            ? 'max-h-96 opacity-100'
                                            : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-5 pt-0 border-t border-gray-100">
                                        <div className="text-gray-700">
                                            {formatAnswer(faq.answer)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <p className="text-gray-600">No FAQs match your search. Try different keywords or browse all questions.</p>
                            {searchTerm && (
                                <button
                                    className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                                    onClick={() => setSearchTerm("")}
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-12 bg-white p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-3">Still have questions?</h2>
                    <p className="text-gray-600 mb-6">Our team is here to help with any questions you might have about pet adoption.</p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
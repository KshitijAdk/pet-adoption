import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is NayaSathi?",
            answer:
                "NayaSathi is a pet adoption platform that connects rescue organizations and foster families with individuals looking to adopt a pet. Our goal is to provide a seamless adoption process while promoting responsible pet ownership.\n\nWe collaborate with shelters and rescuers to ensure every pet finds a loving forever home.",
        },
        {
            question: "How does the pet adoption process work on NayaSathi?",
            answer:
                "The process begins with browsing available pets on our platform. Once you find a pet you're interested in, you can fill out an adoption application. The respective rescue organization will then review your application and guide you through the next steps, including a home check and meeting the pet.",
        },
        {
            question: "Are there any adoption fees?",
            answer:
                "Yes, adoption fees are determined by the rescue organization and vary depending on the pet. These fees cover vaccinations, spaying/neutering, and other medical expenses incurred during the pet's care.",
        },
        {
            question: "What support does NayaSathi offer after adoption?",
            answer:
                "NayaSathi provides resources such as pet care guides, access to training tips, and a community forum where adopters can share their experiences and seek advice. Additionally, we connect you with local veterinary services for ongoing pet care.",
        },
        {
            question: "How can I become a volunteer with NayaSathi?",
            answer:
                "You can join our mission by signing up as a volunteer through our platform. Volunteers assist in various roles, including fostering pets, helping with events, and spreading awareness about adoption.",
        },
    ];

    return (

        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-8">
                Get answers to the most common questions about pet adoption at NayaSathi.
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border rounded-lg shadow-sm overflow-hidden"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="flex justify-between items-center w-full p-4 text-left text-lg font-medium text-gray-800 bg-gray-100 hover:bg-gray-200"
                        >
                            {faq.question}
                            {openIndex === index ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="p-4 text-gray-700 bg-white">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;

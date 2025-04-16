import React from 'react';

const PetDetailModal = ({
    isOpen,
    closeModal,
    title = 'Details',
    imageUrl,
    content,
    footer
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Content area with scroll */}
                <div className="flex-1 overflow-y-auto">
                    {/* Image */}
                    {imageUrl && (
                        <div className="bg-gray-100">
                            <div className="max-w-full mx-auto">
                                <img
                                    src={imageUrl}
                                    alt="Featured"
                                    className="w-full h-72 object-contain mx-auto"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 text-gray-700">
                        {content}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-5 border-t bg-gray-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetDetailModal;
import { CheckCircle, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdoptionConfirmationModal = ({ isOpen, onClose, vendorId }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleDonate = () => {
        navigate(`/vendor/${vendorId}`)
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-md">
                    {/* Modal content */}
                    <div className="bg-white px-6 pb-6 pt-8">
                        <div className="flex flex-col items-center">
                            {/* Checkmark icon */}
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                                <CheckCircle className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-2xl font-bold text-gray-900">
                                Congratulations!
                            </h3>

                            {/* Message */}
                            <div className="mt-3 text-center">
                                <p className="text-gray-600">
                                    You have successfully sent an adoption request for this pet.
                                </p>
                            </div>

                            {/* Donation prompt */}
                            <div className="mt-6 w-full">
                                <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-3 rounded-lg">
                                    <HeartHandshake className="h-5 w-5 text-amber-600" />
                                    <p className="text-sm font-medium text-amber-800">
                                        Please consider donating to support our cause and help more pets find loving homes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-between">
                        <button
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            Not now
                        </button>
                        <button
                            onClick={handleDonate}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Donate Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdoptionConfirmationModal;
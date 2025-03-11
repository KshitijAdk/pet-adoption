import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ChevronLeft } from 'lucide-react';

const AdoptionStatus = () => {
    // Mock status - in a real app, this would come from your backend
    const status = 'pending';

    const getStatusContent = () => {
        switch (status) {
            case 'approved':
                return {
                    icon: <CheckCircle className="h-12 w-12 text-green-500" />,
                    title: 'Application Approved!',
                    message: 'Congratulations! Your adoption application has been approved. We will contact you shortly to schedule a meet-and-greet with your potential new family member.',
                    color: 'text-green-500'
                };
            case 'rejected':
                return {
                    icon: <XCircle className="h-12 w-12 text-red-500" />,
                    title: 'Application Not Approved',
                    message: 'We regret to inform you that your adoption application was not approved at this time. Please contact us for more information or to discuss other adoption opportunities.',
                    color: 'text-red-500'
                };
            default:
                return {
                    icon: <AlertCircle className="h-12 w-12 text-amber-500" />,
                    title: 'Application Under Review',
                    message: 'Your application is currently being reviewed by our team. We will notify you of any updates via email. Thank you for your patience!',
                    color: 'text-amber-500'
                };
        }
    };

    const statusContent = getStatusContent();

    return (
        <div className="container mx-auto px-6 py-8">
            <Link to="/pets" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Pets
            </Link>

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                    {statusContent.icon}
                    <h1 className={`text-2xl font-bold ${statusContent.color} mt-4 mb-2`}>
                        {statusContent.title}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {statusContent.message}
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Application ID: N/A</p>
                        <p className="text-sm text-gray-600 mb-2">Submitted: {new Date().toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h2>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-600">We will review your application within 2-3 business days</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-600">You will receive email updates about your application status</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-600">If approved, we will schedule a meet-and-greet with your potential pet</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Questions about your application?</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdoptionStatus;

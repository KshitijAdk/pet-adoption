import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, XCircle } from 'lucide-react';
import InputField from './ui/InputField';
import Button from './ui/button';
import { AppContent } from '../context/AppContext';

const AdoptionFormModal = ({ isOpen, onClose }) => {
  const { userData, backendUrl } = useContext(AppContent)
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    reasonForAdoption: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adoptionId = Math.random().toString(36).substr(2, 9);

      // Prepare the payload to send to the backend
      const payload = {
        adoptionId,
        petId: id,
        userId: userData?.userId,
        ...formData,
      };

      // Make an API request to submit the adoption application
      const response = await fetch(backendUrl + '/api/adoption/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the application');
      }

      const result = await response.json();
      console.log('Adoption Submission Response:', result);

      setSubmitted(true);

      setTimeout(() => {
        navigate(`/adoption-status/${adoptionId}`);
        onClose(); // Close the modal after successful submission
      }, 1000);
    } catch (err) {
      console.error('Submission Error:', err);
      setError('There was an error submitting your application. Please try again.');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          <XCircle className="h-6 w-6" />
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Adoption Application</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <InputField
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              {['email', 'phone', 'address', 'reasonForAdoption'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <InputField
                    type="text"
                    name={key}
                    required
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              disabled={submitted}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionFormModal;

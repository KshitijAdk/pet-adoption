import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import InputField from './ui/InputField';
import Button from './ui/button';
import { AppContent } from '../context/AppContext';
import Label from './ui/label';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const AdoptionFormModal = ({ isOpen, onClose }) => {
  const { userData, backendUrl } = useContext(AppContent);
  const { petId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    reasonForAdoption: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const adoptionId = uuidv4();

      const payload = {
        adoptionId,
        petId,
        applicantId: userData?.userId,
        fullName: userData?.name,
        email: userData?.email,
        ...formData,
      };

      const response = await fetch(`${backendUrl}/api/adoption/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error(result.message || 'You have already applied for this pet.');
        } else {
          toast.error(result.message || 'Something went wrong. Please try again.');
        }
        setSubmitting(false);
        return;
      }

      toast.success('Adoption request submitted successfully!');
      setTimeout(() => {
        navigate(`/adoption-status/${adoptionId}`);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Submission Error:', err);
      toast.error('Something went wrong. Please try again.');
      setSubmitting(false);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <InputField id="fullName" type="text" name="fullName" value={userData?.name || ''} disabled />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <InputField id="email" type="email" name="email" value={userData?.email || ''} disabled />
              </div>

              {['phone', 'address', 'reasonForAdoption'].map((key) => (
                <div key={key}>
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </Label>
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
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionFormModal;

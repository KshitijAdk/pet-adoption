import { useContext, useState, useEffect } from "react";
import { Upload, Building2, Phone, MapPin, FileText, User, Mail, FileCheck, X } from "lucide-react";
import InputField from "./ui/InputField";
import Button from './ui/button';
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

export default function VendorRegistration() {
    const { backendUrl, userData } = useContext(AppContent);
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [idDocuments, setIdDocuments] = useState([]);
    const [formData, setFormData] = useState({
        fullName: userData?.name || "",
        organization: "",
        email: userData?.email || "",
        contact: "",
        address: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userData?.email) {
            setFormData((prevData) => ({
                ...prevData,
                email: userData.email,
            }));
        }
    }, [userData]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImagePath(file.name);
        }
    };

    const handleIdDocUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newDocuments = files.map(file => ({
                file,
                name: file.name,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                type: file.type
            }));
            setIdDocuments([...idDocuments, ...newDocuments]);
            // Reset file input
            event.target.value = null;
        }
    };

    const removeIdDocument = (index) => {
        const updatedDocuments = [...idDocuments];
        // Revoke object URL to prevent memory leaks
        if (updatedDocuments[index].preview) {
            URL.revokeObjectURL(updatedDocuments[index].preview);
        }
        updatedDocuments.splice(index, 1);
        setIdDocuments(updatedDocuments);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }
        if (!formData.organization.trim()) {
            newErrors.organization = "Organization name is required";
            isValid = false;
        }
        if (!formData.contact.trim()) {
            newErrors.contact = "Contact number is required";
            isValid = false;
        }
        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
            isValid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }

        // Validate image
        if (!image) {
            toast.error("Organization image is required", {
            });
            isValid = false;
        }

        // Validate documents
        if (idDocuments.length === 0) {
            toast.error("At least one identity document is required", {
            });
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("organization", formData.organization);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("contact", formData.contact);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("description", formData.description);

            // Append main image
            if (image) {
                formDataToSend.append("image", image);
            }

            // Append ID documents
            idDocuments.forEach(doc => {
                formDataToSend.append("idDocuments", doc.file);
            });

            const response = await fetch(`${backendUrl}/api/vendors/register`, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Vendor registered successfully!");

                // Reset form
                setFormData({
                    fullName: userData?.name || "",
                    organization: "",
                    email: userData?.email || "",
                    contact: "",
                    address: "",
                    description: "",
                });
                setImage(null);
                setImagePath("");
                idDocuments.forEach(doc => {
                    if (doc.preview) URL.revokeObjectURL(doc.preview);
                });
                setIdDocuments([]);
                setErrors({});
            } else {
                if (response.status === 409) {
                    toast.warn("Application with this email already exists");
                } else {
                    toast.error(data.message || "Failed to register vendor. Please try again.");
                }
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            idDocuments.forEach(doc => {
                if (doc.preview) URL.revokeObjectURL(doc.preview);
            });
        };
    }, []);

    return (
        <div className="min-h-screen flex justify-center items-center bg-amber-50 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Become a Vendor Partner</h2>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto">Join our network of trusted vendors and make a difference in animal welfare</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Organization Image Upload */}
                        <div>
                            <div className="flex items-center mb-2">
                                <Upload size={16} className="text-amber-500 mr-2" />
                                <label className="text-sm font-medium text-gray-700">Organization Image</label>
                            </div>
                            <div className="relative group">
                                <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 aspect-square flex items-center justify-center">
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Uploaded Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-6">
                                            <Upload size={36} className="mx-auto text-gray-300 mb-3" />
                                            <p className="text-amber-500 font-medium text-sm">Upload Organization Image</p>
                                            <p className="text-gray-400 text-xs mt-1">Recommended: 1:1 ratio, min 500x500px</p>
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="upload"
                                    className="absolute bottom-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg cursor-pointer flex items-center space-x-1 hover:bg-amber-600 transition shadow-sm text-sm"
                                >
                                    <Upload size={14} />
                                    <span>Upload</span>
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="upload"
                                    accept="image/*"
                                />
                            </div>
                            {errors.image && (
                                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                            )}
                            {imagePath && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Selected: {imagePath}
                                </p>
                            )}
                        </div>

                        {/* ID Documents Upload */}
                        <div>
                            <div className="flex items-center mb-2">
                                <FileCheck size={16} className="text-amber-500 mr-2" />
                                <label className="text-sm font-medium text-gray-700">Identity Documents</label>
                            </div>

                            {/* Documents Preview Area */}
                            {idDocuments.length > 0 && (
                                <div className="mb-4 space-y-3">
                                    {idDocuments.map((doc, index) => (
                                        <div key={index} className="flex items-center bg-amber-50 p-3 rounded-lg relative">
                                            <div className="flex-shrink-0 h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                                                {doc.preview ? (
                                                    <img
                                                        src={doc.preview}
                                                        alt="Document preview"
                                                        className="h-full w-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <FileText size={24} className="text-amber-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{doc.type}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeIdDocument(index)}
                                                className="text-gray-400 hover:text-red-500 ml-2"
                                                aria-label="Remove document"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative group">
                                <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 h-40 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <Upload size={36} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-amber-500 font-medium text-sm">Upload ID Documents</p>
                                        <p className="text-gray-400 text-xs mt-1">Upload ID card, business license or other verification documents</p>
                                    </div>
                                </div>
                                <label
                                    htmlFor="upload-id"
                                    className="absolute bottom-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg cursor-pointer flex items-center space-x-1 hover:bg-amber-600 transition shadow-sm text-sm"
                                >
                                    <Upload size={14} />
                                    <span>Upload</span>
                                </label>
                                <input
                                    type="file"
                                    onChange={handleIdDocUpload}
                                    className="hidden"
                                    id="upload-id"
                                    accept="image/*,.pdf"
                                    multiple
                                />
                            </div>
                            {errors.idDocuments && (
                                <p className="text-red-500 text-xs mt-1">{errors.idDocuments}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                {idDocuments.length > 0
                                    ? `${idDocuments.length} document${idDocuments.length > 1 ? 's' : ''} selected`
                                    : 'No documents selected'}
                            </p>
                        </div>

                        <div className="bg-amber-50 p-5 rounded-lg">
                            <h3 className="text-base font-medium text-gray-800 mb-3">Why Partner With Us?</h3>
                            <ul className="space-y-2.5">
                                <li className="flex items-start">
                                    <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center mt-1 flex-shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                    </div>
                                    <span className="ml-2.5 text-gray-600 text-sm">Access to a network of pet lovers and animal welfare advocates</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center mt-1 flex-shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                    </div>
                                    <span className="ml-2.5 text-gray-600 text-sm">Contribute to improving animal welfare in your community</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <div className="flex items-center mb-1.5">
                                    <User size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                </div>
                                <InputField
                                    name="fullName"
                                    placeholder="Your full name"
                                    onChange={handleChange}
                                    value={formData.fullName}
                                    readOnly
                                    className="w-full h-11 bg-gray-100 border border-gray-200 rounded-lg px-4 text-gray-500"
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Mail size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                </div>
                                <InputField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full h-11 bg-gray-100 border border-gray-200 rounded-lg px-4 text-gray-500"
                                />
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Building2 size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Organization</label>
                                </div>
                                <InputField
                                    name="organization"
                                    placeholder="Your organization name"
                                    onChange={handleChange}
                                    value={formData.organization}
                                    required
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.organization && (
                                    <p className="text-red-500 text-xs mt-1">{errors.organization}</p>
                                )}
                            </div>



                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Phone size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                </div>
                                <InputField
                                    type="tel"
                                    name="contact"
                                    placeholder="Your contact number"
                                    onChange={handleChange}
                                    value={formData.contact}
                                    required
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.contact && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <MapPin size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                </div>
                                <InputField
                                    name="address"
                                    placeholder="Organization address"
                                    onChange={handleChange}
                                    value={formData.address}
                                    required
                                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <FileText size={16} className="text-amber-500 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">About Your Organization</label>
                                </div>
                                <InputField
                                    as="textarea"
                                    name="description"
                                    placeholder="Tell us about your organization and how you can contribute to animal welfare..."
                                    onChange={handleChange}
                                    value={formData.description}
                                    rows={4}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-amber-500 focus:border-amber-500 resize-none"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-medium hover:bg-amber-600 transition shadow-md disabled:opacity-50 mt-6"
                                variant="primary"
                                text={isLoading ? "Processing..." : "Submit Application"}
                                disabled={isLoading}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
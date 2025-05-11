import { useContext, useState, useEffect } from "react";
import { Upload, Building, Phone, MapPin, FileText, User, Mail, File, X, QrCode } from "lucide-react";
import { AppContent } from "../context/AppContext";
import {message} from 'antd'

export default function VendorRegistration() {
    const { backendUrl, userData } = useContext(AppContent);
    const [files, setFiles] = useState({
        orgImage: null,
        fonepayQr: null,
        idDocuments: []
    });
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
            setFormData(prev => ({
                ...prev,
                email: userData.email,
                fullName: userData.name,
            }));
        }
    }, [userData]);

    const handleFileUpload = (field, e) => {
        const fileList = Array.from(e.target.files);
        if (!fileList.length) return;

        if (field === 'idDocuments') {
            const newDocs = fileList.map(file => ({
                file,
                name: file.name,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
            }));
            setFiles(prev => ({ ...prev, idDocuments: [...prev.idDocuments, ...newDocs] }));
        } else {
            setFiles(prev => ({ ...prev, [field]: fileList[0] }));
        }

        e.target.value = null;
    };

    const removeFile = (field, index) => {
        if (field === 'idDocuments') {
            const updated = [...files.idDocuments];
            if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            setFiles(prev => ({ ...prev, idDocuments: updated }));
        } else {
            setFiles(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Required text fields
        const requiredFields = ['fullName', 'organization', 'contact', 'address', 'description'];
        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field === 'fullName' ? 'Full name' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        // Required files
        if (!files.orgImage) {
            message.error("Organization image is required");
            isValid = false;
        }
        if (!files.fonepayQr) {
            message.error("Fonepay QR code is required");
            isValid = false;
        }
        if (files.idDocuments.length === 0) {
            message.error("At least one identity document is required");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append form data
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Append files
            formDataToSend.append("image", files.orgImage);
            formDataToSend.append("fonepayQr", files.fonepayQr);
            files.idDocuments.forEach(doc => {
                formDataToSend.append("idDocuments", doc.file);
            });

            const response = await fetch(`${backendUrl}/api/vendors/register`, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Vendor registration sent successfully!");
                // Reset form
                setFormData({
                    fullName: userData?.name || "",
                    organization: "",
                    email: userData?.email || "",
                    contact: "",
                    address: "",
                    description: "",
                });
                setFiles({ orgImage: null, fonepayQr: null, idDocuments: [] });
                setErrors({});
            } else {
                message.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            message.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Clean up object URLs
    useEffect(() => {
        return () => {
            files.idDocuments.forEach(doc => {
                if (doc.preview) URL.revokeObjectURL(doc.preview);
            });
        };
    }, [files.idDocuments]);

    const FileUploadBox = ({ field, label, accept, multiple = false }) => (
        <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                {field === 'orgImage' ? <Upload size={16} className="mr-2" /> :
                    field === 'fonepayQr' ? <QrCode size={16} className="mr-2" /> :
                        <File size={16} className="mr-2" />}
                {label}
            </label>

            {(!files[field] || (multiple && files[field].length === 0)) ? (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload</span>
                    <input
                        type="file"
                        onChange={(e) => handleFileUpload(field, e)}
                        className="hidden"
                        accept={accept}
                        multiple={multiple}
                    />
                </label>
            ) : (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {multiple ? (
                        files[field].map((doc, index) => (
                            <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                                <div className="flex items-center">
                                    {doc.preview ? (
                                        <img src={doc.preview} alt="Preview" className="h-10 w-10 object-cover rounded mr-3" />
                                    ) : (
                                        <File className="h-10 w-10 text-gray-400 p-2 bg-gray-100 rounded mr-3" />
                                    )}
                                    <span className="text-sm truncate max-w-xs">{doc.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(field, index)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {field === 'orgImage' || field === 'fonepayQr' ? (
                                    <img
                                        src={URL.createObjectURL(files[field])}
                                        alt="Preview"
                                        className="h-10 w-10 object-cover rounded mr-3"
                                    />
                                ) : (
                                    <File className="h-10 w-10 text-gray-400 p-2 bg-gray-100 rounded mr-3" />
                                )}
                                <span className="text-sm">{files[field].name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(field)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Vendor Registration</h2>
                    <p className="text-gray-600 text-center mb-8">Join our network of trusted vendors</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column - File Uploads */}
                            <div>
                                <FileUploadBox
                                    field="orgImage"
                                    label="Organization Logo"
                                    accept="image/*"
                                />

                                <FileUploadBox
                                    field="fonepayQr"
                                    label="Fonepay QR Code"
                                    accept="image/*"
                                />

                                <FileUploadBox
                                    field="idDocuments"
                                    label="Identity Documents"
                                    accept="image/*,.pdf"
                                    multiple
                                />
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <User size={16} className="mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Mail size={16} className="mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Building size={16} className="mr-2" />
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
                                </div>

                                <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Phone size={16} className="mr-2" />
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                                </div>

                                <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <MapPin size={16} className="mr-2" />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FileText size={16} className="mr-2" />
                                Organization Description
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Tell us about your organization..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
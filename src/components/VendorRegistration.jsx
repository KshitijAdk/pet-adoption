import { useContext, useState, useEffect, useCallback } from "react";
import { Upload, Building, Phone, MapPin, FileText, User, Mail, File, X, QrCode } from "lucide-react";
import { AppContent } from "../context/AppContext";
import { message } from 'antd';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        if (userData?.email) {
            setFormData(prev => ({
                ...prev,
                email: userData.email,
                fullName: userData.name,
            }));
        }
    }, [userData]);

    const createPreview = useCallback((file) => {
        return URL.createObjectURL(file);
    }, []);

    const handleFileUpload = useCallback((field, e) => {
        const fileList = Array.from(e.target.files);
        if (!fileList.length) return;

        const processFiles = async () => {
            // Validate file sizes
            const oversizedFiles = fileList.filter(file => file.size > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                message.error(`The following files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
                return;
            }

            if (field === 'idDocuments') {
                const newDocs = fileList.map(file => ({
                    file,
                    name: file.name,
                    preview: createPreview(file),
                    type: file.type
                }));
                setFiles(prev => ({ ...prev, idDocuments: [...prev.idDocuments, ...newDocs] }));
            } else {
                const file = fileList[0];
                setFiles(prev => ({
                    ...prev,
                    [field]: {
                        file,
                        name: file.name,
                        preview: createPreview(file),
                        type: file.type
                    }
                }));
            }
        };

        processFiles();
        e.target.value = null;
    }, [createPreview]);

    const removeFile = useCallback((field, index) => {
        if (field === 'idDocuments') {
            setFiles(prev => {
                const updated = [...prev.idDocuments];
                if (updated[index]?.preview) {
                    URL.revokeObjectURL(updated[index].preview);
                }
                updated.splice(index, 1);
                return { ...prev, idDocuments: updated };
            });
        } else {
            setFiles(prev => {
                if (prev[field]?.preview) {
                    URL.revokeObjectURL(prev[field].preview);
                }
                return { ...prev, [field]: null };
            });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (files.orgImage?.preview) URL.revokeObjectURL(files.orgImage.preview);
            if (files.fonepayQr?.preview) URL.revokeObjectURL(files.fonepayQr.preview);
            files.idDocuments.forEach(doc => {
                if (doc.preview) URL.revokeObjectURL(doc.preview);
            });
        };
    }, [files]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const requiredFields = ['fullName', 'organization', 'contact', 'address', 'description'];
        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field === 'fullName' ? 'Full name' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        if (!files.orgImage) {
            newErrors.orgImage = "Organization image is required";
            isValid = false;
        }

        if (!files.fonepayQr) {
            newErrors.fonepayQr = "Fonepay QR code is required";
            isValid = false;
        }

        if (!files.idDocuments || files.idDocuments.length === 0) {
            newErrors.idDocuments = "At least one identity document is required";
            isValid = false;
        } else if (files.idDocuments.length > 5) {
            message.error("Maximum 5 identity documents are allowed");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file.file || file);
        formData.append('upload_preset', uploadPreset);

        const isImage = file.type.startsWith('image/');
        const endpoint = isImage
            ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
            : `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                return data.secure_url;
            } else {
                throw new Error(data.error?.message || 'Failed to upload file');
            }
        } catch (error) {
            console.error(`Cloudinary upload error for ${file.name || 'file'}:`, error.message);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);

        try {
            // Validate file sizes again before upload (redundant but ensures no oversized files slip through)
            if (files.orgImage?.file.size > MAX_FILE_SIZE || files.fonepayQr?.file.size > MAX_FILE_SIZE ||
                files.idDocuments.some(doc => doc.file.size > MAX_FILE_SIZE)) {
                message.error("One or more files exceed the 10MB limit. Please upload smaller files.");
                setIsLoading(false);
                return;
            }

            const [orgImageUrl, fonepayQrUrl] = await Promise.all([
                uploadToCloudinary(files.orgImage),
                uploadToCloudinary(files.fonepayQr)
            ]);

            const idDocumentUrls = await Promise.all(
                files.idDocuments.map(doc => uploadToCloudinary(doc))
            );

            const vendorData = {
                ...formData,
                image: orgImageUrl,
                fonepayQr: fonepayQrUrl,
                idDocuments: idDocumentUrls,
                userId: userData?.userId,
            };

            const response = await fetch(`${backendUrl}/api/vendors/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vendorData)
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Vendor registration submitted successfully!");
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
            message.error(`Something went wrong: ${error.message}. Please try again.`);
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const FileUploadBox = ({ field, label, accept, multiple = false }) => {
        const currentFiles = files[field];

        return (
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    {field === 'orgImage' ? (
                        <Upload size={16} className="mr-2" />
                    ) : field === 'fonepayQr' ? (
                        <QrCode size={16} className="mr-2" />
                    ) : (
                        <File size={16} className="mr-2" />
                    )}
                    {label}
                    {errors[field] && (
                        <span className="text-red-500 text-xs ml-2">({errors[field]})</span>
                    )}
                </label>

                <p className="text-xs text-gray-500 mb-2">
                    Maximum file size: 10MB.{' '}
                    {field === 'orgImage' || field === 'fonepayQr'
                        ? ' (Only 1 image allowed.)'
                        : ' (Max 5 images aloowed.)'}
                </p>


                {(!currentFiles || (multiple && currentFiles.length === 0)) ? (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload (max 10MB)</span>
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
                            currentFiles.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                                    <div className="flex items-center">
                                        {doc.type.startsWith('image/') ? (
                                            <img
                                                src={doc.preview}
                                                alt="Preview"
                                                className="h-10 w-10 object-cover rounded mr-3"
                                                onError={(e) => {
                                                    e.target.src = URL.createObjectURL(doc.file);
                                                }}
                                            />
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
                                    {currentFiles.type.startsWith('image/') ? (
                                        <img
                                            src={currentFiles.preview}
                                            alt="Preview"
                                            className="h-10 w-10 object-cover rounded mr-3"
                                            onError={(e) => {
                                                e.target.src = URL.createObjectURL(currentFiles.file);
                                            }}
                                        />
                                    ) : (
                                        <File className="h-10 w-10 text-gray-400 p-2 bg-gray-100 rounded mr-3" />
                                    )}
                                    <span className="text-sm">{currentFiles.name}</span>
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
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Vendor Registration</h2>
                    <p className="text-gray-600 text-center mb-8">Join our network of trusted vendors</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FileUploadBox field="orgImage" label="Organization Logo" accept="image/*" />
                                <FileUploadBox field="fonepayQr" label="Fonepay QR Code" accept="image/*" />
                                <FileUploadBox field="idDocuments" label="Identity Documents" accept="image/*,.pdf" multiple />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <User size={16} className="mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Mail size={16} className="mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
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
                                        className={`w-full px-3 py-2 border ${errors.organization ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    />
                                    {errors.organization && <p className="text-sm text-red-600 mt-1">{errors.organization}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Phone size={16} className="mr-2" />
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    />
                                    {errors.contact && <p className="text-sm text-red-600 mt-1">{errors.contact}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <MapPin size={16} className="mr-2" />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    />
                                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FileText size={16} className="mr-2" />
                                Organization Description
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Tell us about your organization..."
                            />
                            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition disabled:opacity-70"
                            >
                                {isLoading ? "Submitting..." : "Submit Registration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
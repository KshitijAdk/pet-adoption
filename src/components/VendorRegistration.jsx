import { useContext, useState, useEffect } from "react";
import { Upload, Building2, Phone, MapPin, FileText, User, Mail } from "lucide-react";
import InputField from "./ui/InputField";
import Button from './ui/button';
import defaultImg from '../assests/dog.jpg';
import { AppContent } from "../context/AppContext";

export default function VendorRegistration() {
    const { backendUrl, userData, isLoggedin } = useContext(AppContent);
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.organization.trim()) newErrors.organization = "Organization name is required";
        if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!image) newErrors.image = "Image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            let imageUrl = null;
            if (image) {
                const formDataCloudinary = new FormData();
                formDataCloudinary.append("file", image);
                formDataCloudinary.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`);
                const cloudinaryResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: "POST", body: formDataCloudinary }
                );
                if (!cloudinaryResponse.ok) throw new Error("Failed to upload image");
                const cloudinaryData = await cloudinaryResponse.json();
                imageUrl = cloudinaryData.secure_url;
            }
            const dataToSend = { ...formData, image: imageUrl };
            const response = await fetch(backendUrl + "/api/vendors/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });
            if (response.ok) {
                alert("Vendor registered successfully!");
                setFormData({
                    fullName: "",
                    organization: "",
                    email: userData?.email || "",
                    contact: "",
                    address: "",
                    description: "",
                });
                setImage(null);
                setImagePath("");
                setErrors({});
            } else {
                alert("Failed to register vendor. Please try again.");
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-2">Become a Vendor Partner</h2>
                    <p className="text-gray-600 max-w-lg mx-auto">Join our network of trusted vendors and make a difference in animal welfare</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="relative group">
                            <div className="overflow-hidden rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50 aspect-square flex items-center justify-center">
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload size={48} className="mx-auto text-indigo-300 mb-4" />
                                        <p className="text-indigo-500 font-medium">Upload Organization Image</p>
                                        <p className="text-gray-500 text-sm mt-2">Recommended: 1:1 ratio, min 500x500px</p>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="upload"
                                className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2 hover:bg-indigo-700 transition shadow-md"
                            >
                                <Upload size={16} />
                                <span>Upload</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="upload"
                                accept="image/*"
                                required
                            />
                        </div>
                        {errors.image && (
                            <p className="text-red-500 text-sm">{errors.image}</p>
                        )}
                        {imagePath && (
                            <p className="text-sm text-gray-600">
                                Selected: {imagePath}
                            </p>
                        )}

                        <div className="bg-indigo-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Why Partner With Us?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <span className="ml-3 text-gray-700">Access to a network of pet lovers and animal welfare advocates</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <span className="ml-3 text-gray-700">Contribute to improving animal welfare in your community</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <div className="flex items-center mb-1.5">
                                    <User size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                </div>
                                <InputField
                                    name="fullName"
                                    placeholder="Your full name"
                                    onChange={handleChange}
                                    value={formData.fullName}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Building2 size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Organization</label>
                                </div>
                                <InputField
                                    name="organization"
                                    placeholder="Your organization name"
                                    onChange={handleChange}
                                    value={formData.organization}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                {errors.organization && (
                                    <p className="text-red-500 text-xs mt-1">{errors.organization}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Mail size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                </div>
                                <InputField
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500"
                                />
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <Phone size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                                </div>
                                <InputField
                                    type="tel"
                                    name="contact"
                                    placeholder="Your contact number"
                                    onChange={handleChange}
                                    value={formData.contact}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                {errors.contact && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <MapPin size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                </div>
                                <InputField
                                    name="address"
                                    placeholder="Organization address"
                                    onChange={handleChange}
                                    value={formData.address}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center mb-1.5">
                                    <FileText size={16} className="text-indigo-600 mr-2" />
                                    <label className="text-sm font-medium text-gray-700">About Your Organization</label>
                                </div>
                                <InputField
                                    as="textarea"
                                    name="description"
                                    placeholder="Tell us about your organization and how you can contribute to animal welfare..."
                                    onChange={handleChange}
                                    value={formData.description}
                                    rows={5}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-md disabled:opacity-50 mt-4"
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
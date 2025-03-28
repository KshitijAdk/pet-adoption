import { useContext, useState, useEffect } from "react";
import { Upload, Building2, Phone, MapPin, FileText, User } from "lucide-react";
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
        <div className="min-h-screen flex justify-center items-center p-6">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-800 mb-2">Become a Vendor Partner</h2>
                    <p className="text-gray-600">Join our network of trusted vendors and make a difference in animal welfare</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                        <div className="relative group">
                            <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded Preview"
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <img
                                        src={defaultImg}
                                        alt="Default Preview"
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <label
                                htmlFor="upload"
                                className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2 hover:bg-purple-700 transition duration-300 shadow-lg"
                            >
                                <Upload size={18} />
                                <span>Upload Image</span>
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
                            <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                        )}
                        {imagePath && (
                            <p className="text-sm text-gray-600 mt-2">
                                Selected: {imagePath}
                            </p>
                        )}
                    </div>

                    <div className="w-full md:w-1/2">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-purple-700">
                                    <User size={18} />
                                    <InputField
                                        name="fullName"
                                        placeholder="Full Name"
                                        onChange={handleChange}
                                        value={formData.fullName}
                                        required
                                        className="border-purple-200 focus:border-purple-500"
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-purple-700">
                                    <Building2 size={18} />
                                    <InputField
                                        name="organization"
                                        placeholder="Organization Name"
                                        onChange={handleChange}
                                        value={formData.organization}
                                        required
                                        className="border-purple-200 focus:border-purple-500"
                                    />
                                </div>
                                {errors.organization && (
                                    <p className="text-red-500 text-sm">{errors.organization}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 text-purple-700 bg-purple-50 rounded-lg p-3">
                                <InputField 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    readOnly 
                                    className="bg-transparent border-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-purple-700">
                                    <Phone size={18} />
                                    <InputField
                                        type="tel"
                                        name="contact"
                                        placeholder="Contact Number"
                                        onChange={handleChange}
                                        value={formData.contact}
                                        required
                                        className="border-purple-200 focus:border-purple-500"
                                    />
                                </div>
                                {errors.contact && (
                                    <p className="text-red-500 text-sm">{errors.contact}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-purple-700">
                                    <MapPin size={18} />
                                    <InputField
                                        name="address"
                                        placeholder="Organization Address"
                                        onChange={handleChange}
                                        value={formData.address}
                                        required
                                        className="border-purple-200 focus:border-purple-500"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-red-500 text-sm">{errors.address}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-start space-x-2 text-purple-700">
                                    <FileText size={18} className="mt-2" />
                                    <InputField
                                        as="textarea"
                                        name="description"
                                        placeholder="Tell us about your organization and how you can contribute to animal welfare..."
                                        onChange={handleChange}
                                        value={formData.description}
                                        rows={4}
                                        required
                                        className="border-purple-200 focus:border-purple-500 resize-none"
                                    />
                                </div>
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-lg disabled:opacity-50"
                                variant="primary"
                                text={isLoading ? "Processing..." : "Submit Application"}
                                disabled={isLoading}
                            />
                        </form>
                    </div>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Why Partner With Us?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></div>
                            <p>Access to a network of pet lovers and animal welfare advocates</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></div>
                            <p>Contribute to improving animal welfare in your community</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></div>
                            <p>Grow your business while making a positive impact</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
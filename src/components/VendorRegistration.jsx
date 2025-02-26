import { useContext, useState, useEffect } from "react";
import { Upload } from "lucide-react";
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
        email: userData?.email || "", // Set email from userData
        contact: "",
        address: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Inside your component
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
        <div className="min-h-screen bg-purple-300 flex justify-center items-center p-6">
            <div className="bg-purple-200 p-8 rounded-lg shadow-md w-full max-w-3xl">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Preview"
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        ) : (
                            <img
                                src={defaultImg}
                                alt="Default Preview"
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        )}
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 px-4">
                        <h2 className="text-2xl font-bold text-gray-900">Vendor Registration Form</h2>
                        <p className="text-gray-700 text-sm mb-4">
                            Please fill out the form below to apply as a vendor
                        </p>

                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <InputField
                                name="fullName"
                                placeholder="Enter your full name"
                                onChange={handleChange}
                                value={formData.fullName}
                                required
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm">{errors.fullName}</p>
                            )}

                            <InputField
                                name="organization"
                                placeholder="Enter organization name"
                                onChange={handleChange}
                                value={formData.organization}
                                required
                            />
                            {errors.organization && (
                                <p className="text-red-500 text-sm">{errors.organization}</p>
                            )}

                            <InputField type="email" name="email" value={formData.email} readOnly />


                            <InputField
                                type="tel"
                                name="contact"
                                placeholder="Enter contact number"
                                onChange={handleChange}
                                value={formData.contact}
                                required
                            />
                            {errors.contact && (
                                <p className="text-red-500 text-sm">{errors.contact}</p>
                            )}

                            <InputField
                                name="address"
                                placeholder="Enter organization address"
                                onChange={handleChange}
                                value={formData.address}
                                required
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm">{errors.address}</p>
                            )}

                            <InputField
                                as="textarea"
                                name="description"
                                placeholder="Describe your organization"
                                onChange={handleChange}
                                value={formData.description}
                                rows={3}
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description}</p>
                            )}

                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="upload"
                                    required
                                />
                                <label
                                    htmlFor="upload"
                                    className="bg-purple-400 text-white px-4 py-2 rounded cursor-pointer flex items-center space-x-1 hover:bg-purple-500 hover:shadow-lg transition duration-300"
                                >
                                    <Upload size={16} />
                                    <span>Choose File</span>
                                </label>

                                <span className="text-gray-600">
                                    {imagePath || "No file chosen"}
                                </span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
                                variant="primary"
                                text={isLoading ? "Submitting..." : "Submit"}
                                disabled={isLoading}
                            />
                        </form>
                    </div>
                </div>
                <div className="mt-6 bg-gray-200 p-4 rounded text-center">
                    <p className="text-gray-800">Join us in creating a better future for animals in need</p>
                </div>
            </div>
        </div>
    );
}
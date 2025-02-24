import { useState } from "react";
import { Upload } from "lucide-react";
import InputField from "./ui/InputField";
import Button from './ui/button';
import defaultImg from '../assests/dog.jpg';

export default function VendorRegistration() {
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        organization: "",
        email: "",
        contact: "",
        address: "",
        description: "",
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Store the file itself
            setImagePath(file.name); // Display the file name
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Prepare data as a plain object
        const dataObject = {
            ...formData,
            imageName: image ? image.name : null, // Only send image name
        };

        // Log the object for confirmation
        console.log("Submitted Data Object:", dataObject);

        // If there's an image, prepare it separately
        if (image) {
            console.log("Image File:", image);
        }

        // Here, you can later add API calls when needed
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
                    </div>

                    <div className="w-full md:w-1/2 px-4">
                        <h2 className="text-2xl font-bold text-gray-900">Vendor Registration Form</h2>
                        <p className="text-gray-700 text-sm mb-4">
                            Please fill out the form below to apply as a vendor
                        </p>
                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <InputField name="fullName" placeholder="Enter your full name" onChange={handleChange} value={formData.fullName} />
                            <InputField name="organization" placeholder="Enter organization name" onChange={handleChange} value={formData.organization} />
                            <InputField type="email" name="email" placeholder="Enter contact email" onChange={handleChange} value={formData.email} />
                            <InputField type="tel" name="contact" placeholder="Enter contact number" onChange={handleChange} value={formData.contact} />
                            <InputField name="address" placeholder="Enter organization address" onChange={handleChange} value={formData.address} />
                            <InputField as="textarea" name="description" placeholder="Describe your organization" onChange={handleChange} value={formData.description} rows={3} />

                            <div className="flex items-center space-x-2">
                                <input type="file" onChange={handleImageUpload} className="hidden" id="upload" />
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

                            <Button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800" variant="primary" text="Submit" />
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

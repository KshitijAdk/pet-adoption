import React from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types"; // Optional: For type checking

const InputField = ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    isPasswordShown,
    togglePasswordVisibility,
    error,
    ...props
}) => {
    // Convert value to string if it's a number
    const stringValue = typeof value === 'number' ? value.toString() : value;

    return (
        <div className="relative mb-4">
            {/* Label */}
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {/* Input Field */}
            <input
                id={id}
                type={isPasswordShown && type === "password" ? "text" : type}
                placeholder={placeholder}
                value={stringValue} // Use the string value
                onChange={onChange}
                className={`w-full h-10 px-4 text-base border ${error ? "border-red-500" : "border-[#bfb3f2]"
                    } rounded-lg focus:border-[#5F41E4] focus:ring-2 focus:ring-[#c8aefb] focus:outline-none placeholder-[#9284c8] transition ease-in-out`}
                {...props}
            />

            {/* Password Toggle Icon */}
            {type === "password" && togglePasswordVisibility && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-10 right-3 transform -translate-y-1/2 text-[#917DE8] cursor-pointer text-xl focus:outline-none"
                    aria-label={isPasswordShown ? "Hide password" : "Show password"}
                >
                    {isPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {/* Error Message */}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};


// PropTypes for type checking (optional)
InputField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    isPasswordShown: PropTypes.bool,
    togglePasswordVisibility: PropTypes.func,
    error: PropTypes.string,
};

export default InputField;
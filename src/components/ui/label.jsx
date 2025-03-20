const Label = ({ children, htmlFor }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {children}
        </label>
    );
};

export default Label;

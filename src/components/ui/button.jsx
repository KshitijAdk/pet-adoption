import PropTypes from "prop-types";

const Button = ({ children, text, onClick, variant = "primary", className = "", icon, ...props }) => {
  // Modern, clean button styles
  const baseStyles = "w-full font-medium transition-all duration-200 flex items-center justify-center h-10 text-base rounded-lg";

  // Simple, beautiful variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-500 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow"
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      type="button"
      {...props}
    >
      {icon && <span className="mr-3 flex items-center">{icon}</span>}
      {text || children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  icon: PropTypes.node
};

export default Button;
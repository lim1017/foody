import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...rest
}) => {
  let buttonStyle = "bg-red-500 text-white hover:bg-red-400";

  switch (variant) {
    case "secondary":
      buttonStyle = "bg-gray-100 text-gray-900 hover:bg-gray-200";
      break;
    case "tertiary":
      buttonStyle = "text-gray-900 hover:text-gray-800";
      break;
    default:
      break;
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out focus:outline-none ${buttonStyle} ${className}`}
      {...rest}
    />
  );
};

export default Button;

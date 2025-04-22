import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "gold",
  size = "md",
  className = "",
  as: Component = "button",
  ...props
}) => {
  const base = "rounded-md font-cinzel transition-all duration-200";
  const variants = {
    gold: "bg-antique-gold hover:bg-[#c49d3a] text-ink-black",
    brown: "bg-warm-brown hover:bg-[#7b4f2a] text-ivory",
    gray: "bg-warm-gray/80 text-ink-black hover:bg-warm-gray",
    outline: "border border-warm-brown text-warm-brown hover:bg-parchment",
    transparent: "bg-transparent text-ink-black hover:bg-parchment/60",
  };
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;

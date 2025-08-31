import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  disabled?: boolean;
}
function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full cursor-pointer bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 rounded-lg transition-colors duration-200`}
    >
      {children}
    </button>
  );
}

export default Button;

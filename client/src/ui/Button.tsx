export default function Button({
  onClick,
  children,
  disabled = false,
  type = "dark",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn rounded border-none px-10 py-3 font-semibold disabled:opacity-30 disabled:hover:cursor-not-allowed ${type === "light" ? "+ bg-transparent text-[#004AD7]" : "+ bg-[#004AD7] text-white hover:bg-[#2757b1] "} ${className}`}
    >
      {children}
    </button>
  );
}

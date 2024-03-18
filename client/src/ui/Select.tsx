import { ChangeEvent } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  // You can add more props here if needed
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  ...props
}) => {
  return (
    <select
      className="w-2/4 rounded border border-gray-400 px-6 py-3 text-gray-500 outline-blue-500"
      {...props}
      onChange={onChange}
      value={value}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;

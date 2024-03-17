export default function Select({ options, value, onChange, ...props }) {
  return (
    <select
      className="rounded border border-gray-400 px-6 py-3 text-gray-500 outline-blue-500 w-2/4"
      {...props}
      onChange={onChange}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

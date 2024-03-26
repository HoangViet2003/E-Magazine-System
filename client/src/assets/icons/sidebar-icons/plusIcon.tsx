export default function plusIcon({ fill = "#6B6C7E" }: { fill: string }) {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill={"none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H20M12 4V20"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function fileDocLight({ fill = "#222222" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 13.5V15.5C19 18.3284 19 19.7426 18.1213 20.6213C17.2426 21.5 15.8284 21.5 13 21.5H11C8.17157 21.5 6.75736 21.5 5.87868 20.6213C5 19.7426 5 18.3284 5 15.5V9.5C5 6.67157 5 5.25736 5.87868 4.37868C6.75736 3.5 8.17157 3.5 11 3.5H12"
        stroke={fill}
        strokeLinecap="round"
      />
      <path d="M18 3.5L18 9.5" stroke={fill} strokeLinecap="round" />
      <path d="M21 6.5L15 6.5" stroke={fill} strokeLinecap="round" />
      <path d="M9 13.5L15 13.5" stroke={fill} strokeLinecap="round" />
      <path d="M9 9.5L13 9.5" stroke={fill} strokeLinecap="round" />
      <path d="M9 17.5L13 17.5" stroke={fill} strokeLinecap="round" />
    </svg>
  );
}

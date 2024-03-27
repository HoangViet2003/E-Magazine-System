export default function trash({ fill = "#6B6C7E" }: { fill: string }) {
  return (
    <svg
      width="12"
      height="17"
      viewBox="0 0 12 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0.5V1.52924H12V3.50351H0V1.52924H3V0.5H9ZM0 14.2731C0 15.502 1 16.5 2.23145 16.5H9.76562C10.9971 16.5 11.9971 15.502 11.9971 14.2731V4.52339H0V14.2731ZM2 6.51949H10V13.7616C10 14.1702 9.66602 14.5039 9.25586 14.5039H2.74414C2.33398 14.5039 2 14.1702 2 13.7616V6.51949ZM7 7.48636H9V13.4747H7V7.48636ZM5 7.48636H3V13.4747H5V7.48636Z"
        fill={fill}
      />
    </svg>
  );
}
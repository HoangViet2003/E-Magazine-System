export default function angle_fill({
  fill,
  className,
}: {
  fill: string;
  className: string;
}) {
  return (
    <svg
      fill={fill}
      // width={width}
      // height={height}
      viewBox="-12 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>angle-left</title>
      <path d="M7.28 23.28c-0.2 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2l6.44-6.44c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-5.8 5.84 5.84 5.84c0.32 0.32 0.32 0.84 0 1.2-0.16 0.16-0.44 0.24-0.64 0.24z"></path>
    </svg>
  );
}

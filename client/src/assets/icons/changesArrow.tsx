const ChangesArrow: React.FC<{ isIncrease: boolean }> = ({ isIncrease }) => {
  return (
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isIncrease ? "" : "rotate-180"}
    >
      <path
        d="M0.25 4.5L4 0.75L7.75 4.5H0.25Z"
        fill={isIncrease ? "#05CD99" : "#FA5A7D"}
      />
    </svg>
  );
};

export default ChangesArrow;

interface SummaryItemProps {
  icon: string;
  iconBg: string;
  background: string;
  data: number;
  type: string;
  changePercentage: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  iconBg,
  background,
  data,
  type,
  changePercentage,
}) => {
  return (
    <div
      className="flex flex-1 flex-col items-start gap-[14px] px-6 py-5"
      style={{ background: background }}
    >
      <div
        className="inline rounded-full p-[10px]"
        style={{ background: iconBg }}
      >
        <img src={icon} />
      </div>
      <h3 className="text-[32px] font-semibold leading-none">{data}</h3>
      <p className="text-nowrap text-base font-medium">{type}</p>

      {changePercentage !== 0 && (
        <span
          className="text-nowrap text-xs font-medium"
          style={{ color: changePercentage > 0 ? "#00AC4F" : "#FA5A7D" }}
        >
          {changePercentage > 0 && <span>+</span>}
          {changePercentage}% from last month
        </span>
      )}
    </div>
  );
};

export default SummaryItem;

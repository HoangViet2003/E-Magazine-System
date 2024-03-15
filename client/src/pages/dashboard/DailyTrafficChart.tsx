import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import IncreaseIcon from "../../assets/icons/increase.svg";

const data = [
  {
    name: "A",
    value: 25,
  },
  {
    name: "B",
    value: 54,
  },
  {
    name: "C",
    value: 37,
  },
  {
    name: "D",
    value: 19,
  },
  {
    name: "E",
    value: 68,
  },
  {
    name: "F",
    value: 72,
  },
  {
    name: "G",
    value: 81,
  },
];

export default function DailyTrafficChart() {
  return (
    <div className="border border-borderColor p-6 shadow">
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-medium">Daily Traffic</h4>
          <span className="text-[34px] font-bold">2,579 </span>
          <span className="text-sm font-medium">Visitors</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={IncreaseIcon} />
          <span className="text-xs font-bold" style={{ color: "#05CD99" }}>
            +2.45%
          </span>
        </div>
      </div>

      <div>
        <ResponsiveContainer width="100%" height={275}>
          <BarChart width={600} height={300} data={data} cx="50%" cy="50%">
            <XAxis dataKey="name" stroke="#0B5FFF" tickMargin={10} />
            <Tooltip />
            <Bar dataKey="value" fill="#0B5FFF" barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

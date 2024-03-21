import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import ChangesArrow from "../../assets/icons/changesArrow";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

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

let changes = 2.45;

export default function DailyTrafficChart() {
  const windowWidth = useWindowWidth();

  return (
    <div className="grid border border-borderColor p-6 shadow-lg md:col-span-2 2xl:col-span-1">
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-medium">Daily Traffic</h4>
          <span className="text-[34px] font-bold">2,579</span>
          <span className="text-sm font-medium">Visitors</span>
        </div>

        {changes !== 0 && (
          <div className="flex items-center gap-2">
            <ChangesArrow isIncrease={changes > 0} />

            <span
              className="text-xs font-bold"
              style={{ color: changes > 0 ? "#05CD99" : "#FA5A7D" }}
            >
              {changes > 0 && <span>+</span>}
              {changes}%
            </span>
          </div>
        )}
      </div>

      <div>
        <ResponsiveContainer width="100%" height={275}>
          <BarChart width={600} data={data} cx="50%" cy="50%">
            <XAxis dataKey="name" stroke="#0B5FFF" tickMargin={10} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#0B5FFF"
              barSize={windowWidth > 768 && windowWidth < 1536 ? 70 : 15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

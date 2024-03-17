import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./chart.css";

const fakeData = [
  {
    name: "Not Selected",
    value: 100 - 47,
    color: "#D3D3D3",
  },
  {
    name: "Selected",
    value: 47,
    color: "#0B5FFF",
  },
];

function DurationChart() {
  const data = fakeData;
  const data02 = [{ name: "Selected", value: 100 }];

  return (
    <div className="border border-borderColor px-8 pb-[30px] pt-9 shadow-lg">
      <h2 className=" text-[22px] font-medium">Selected Rate</h2>
      <div className="relative">
         <ResponsiveContainer width="100%" height={300}>
          <PieChart className="test">
            <Pie
              startAngle={-270}
              data={data}
              nameKey="duration"
              dataKey="value"
              innerRadius={94}
              outerRadius={110}
              cx="50%"
              cy="50%"
            >
              {data.map((entry) => (
                <Cell
                  fill={entry.color}
                  stroke={entry.color}
                  key={entry.name}
                />
              ))}
            </Pie>

            <Pie
              data={data02}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={50}
              fill="#0B5FFF"
              stroke="none"
            />

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              align="left"
              layout="horizontal"
              iconSize={15}
              iconType="circle"
              payload={data
                .map(({ name, color }) => ({
                  value: name,
                  color,
                }))
                .reverse()}
              wrapperStyle={{
                paddingTop: 20,
                display: "flex",
                alignItems: "center",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute left-2/4 top-2/4 translate-x-[-50%] translate-y-[-120%] text-[22px] font-medium text-white">
          47%
        </div>
      </div>
    </div>
  );
}

export default DurationChart;

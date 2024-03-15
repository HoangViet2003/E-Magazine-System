import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "",
    count: 0,
  },
  {
    name: "Jan",
    count: 100,
  },
  {
    name: "Page B",
    count: 500,
  },
  {
    name: "Page C",
    count: 250,
  },
  {
    name: "Page D",
    count: 300,
  },
  {
    name: "Page E",
    count: 200,
  },
  {
    name: "Page F",
    count: 300,
  },
  {
    name: "Page G",
    count: 400,
  },
];

export default function SubmissionTrendsChart() {
  return (
    <div className="pb-10 px-5 pt-4 border border-borderColor shadow-md">
      <h2 className="text-xl font-bold mb-6">Submission Trends Over Time</h2>

      <ResponsiveContainer width="100%" height={600}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#e6e6e6" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area dataKey="count" stroke="#0B5FFF" fill="none" strokeWidth={4} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

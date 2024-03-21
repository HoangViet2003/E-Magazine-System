import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

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
    name: "Feb",
    count: 500,
  },
  {
    name: "Mar",
    count: 250,
  },
  {
    name: "Apr",
    count: 300,
  },
  {
    name: "May",
    count: 200,
  },
  {
    name: "Jun",
    count: 300,
  },
  {
    name: "Aug",
    count: 400,
  },
  {
    name: "Sep",
    count: 320,
  },
  {
    name: "Oct",
    count: 370,
  },
  {
    name: "Nov",
    count: 180,
  },
  {
    name: "Dec",
    count: 270,
  },
];

export default function SubmissionTrendsChart() {
  const windowWidth = useWindowWidth();

  return (
    <div className="border border-borderColor px-5 pb-10 pt-4 shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Submission Trends Over Time</h2>

      <ResponsiveContainer width="100%" height={windowWidth > 768 ? 600 : 300}>
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

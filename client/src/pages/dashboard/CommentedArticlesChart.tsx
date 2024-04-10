import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useArticle } from "../../redux/hooks";

const fakeData = [
  {
    name: "Commented",
    value: 27,
    color: "#FF3A29",
  },
  {
    name: "Not yet",
    value: 59,
    color: "#0B5FFF",
  },
  // {
  //   name: "Yup",
  //   value: 5,
  //   color: "#FFB200",
  // },
];

export default function CommentedArticlesChart() {
  const { dashboard } = useArticle();

  const data = [
    {
      name: "Commented",
      value: dashboard.totalSubmissionsWithComments,
      color: "#FF3A29",
    },
    {
      name: "Not yet",
      value: dashboard.totalSubmissionsWithoutComments,
      color: "#0B5FFF",
    },
  ];

  return (
    <div className="border border-borderColor px-8 pb-[30px] pt-9 shadow-lg">
      <h2 className="text-[22px] font-medium">Commented Articles</h2>
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart className="test">
            <Pie
              startAngle={0}
              data={data}
              nameKey="duration"
              dataKey="value"
              innerRadius={0}
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

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              align="left"
              layout="horizontal"
              iconSize={15}
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
                display: "flex",
                alignItems: "center",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

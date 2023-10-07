import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = [
  "#F5B041",

  "#F9E79F",
  "#2E86C1",
  "#7D3C98",
  "#F4D03F",
  "#CB4335",
  "#48C9B0",
  "#2ECC71",
  "#F0B27A",
  "#CACFD2",
  "#34495E",
  "#E59866",
  "#D2B4DE",
  "#2874A6",
  "#BA4A00",
  "#F7F9F9",
];

export default function PieCharter({ data }: { data: any }) {
  console.log(data.length);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={80}
          fill="aqua"
          fillOpacity={1}
          strokeWidth={0}
          cornerRadius={2}
          paddingAngle={1}
        >
          {data.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip contentStyle={{ borderRadius: 10 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

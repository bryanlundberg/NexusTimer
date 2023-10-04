import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Solve } from "@/interfaces/Solve";

export default function LineCharter({ data }: { data: any }) {
  const transformData = () => {
    interface Data {
      Time: number;
    }

    const newData: Data[] = [];
    if (data.global.length <= 0) return [{ id: 0, time: 0 }];
    data.global.map((item: Solve) => {
      newData.unshift({ Time: item.time / 1000 });
    });
    return newData;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={transformData()}
        margin={{ top: 30, right: 0, left: 30, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="5 5 5" fillOpacity={0.05} fill="gray" />
        <XAxis interval={5} />
        <YAxis dataKey="Time" orientation="right" />
        <Tooltip
          contentStyle={{ backgroundColor: "black", borderRadius: 10 }}
          labelStyle={{ color: "white" }}
          cursor={{ stroke: "gray", strokeWidth: 2 }}
        />
        <Legend />
        <Line type="monotone" dataKey="Time" stroke="aqua" />
      </LineChart>
    </ResponsiveContainer>
  );
}

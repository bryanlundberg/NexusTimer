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

export default function LineCharter({
  data,
  cubeSelected,
}: {
  data: any;
  cubeSelected: boolean;
}) {
  let interval = 1;
  const transformData = () => {
    interface Data {
      Time: number;
    }

    const newData: Data[] = [];

    if (cubeSelected) {
      if (data.cubeAll.length <= 0) return [{ Time: 0 }];
      data.cubeAll.map((item: Solve) => {
        newData.unshift({ Time: item.time / 1000 });
      });
      interval = parseInt((newData.length / 4).toFixed(0));
      return newData;
    }

    if (!cubeSelected) {
      if (data.global.length <= 0) return [{ Time: 0 }];
      data.global.map((item: Solve) => {
        newData.unshift({ Time: item.time / 1000 });
      });
      interval = parseInt((newData.length / 4).toFixed(0));
      return newData;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={transformData()}
        margin={{ top: 30, right: 0, left: 30, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="4 4 4" fillOpacity={0.3} fill="black" />
        <XAxis interval={interval} />
        <YAxis dataKey="Time" orientation="right" />
        <Tooltip
          contentStyle={{ backgroundColor: "black", borderRadius: 10 }}
          labelStyle={{ color: "white" }}
          cursor={{ stroke: "gray", strokeWidth: 2 }}
        />
        <Legend />
        <Line type="monotone" dataKey="Time" stroke="#F4D03F" />
      </LineChart>
    </ResponsiveContainer>
  );
}

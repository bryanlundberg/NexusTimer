import { useSettingsModalStore } from "@/store/SettingsModalStore";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import translation from "@/translations/global.json";

export default function RadarCharter({ data }: { data: any }) {
  const { lang } = useSettingsModalStore();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis />
        <Radar
          name={translation.metrics["total"][lang]}
          dataKey="time"
          stroke="#F4D03F"
          strokeWidth={1.25}
          fill="#F4D03F"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "black", borderRadius: 10 }}
          labelStyle={{ color: "white" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

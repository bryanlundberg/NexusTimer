import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import AreaChart from "./AreaChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PersonalStatistics() {
  const { cubes } = useTimerStore();
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 53],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Cuber Classification" total={"Rookie"} />
          <CardStatistic label="Rating Points" total={0} />
          <CardStatistic label="Time Spent Cubing" total={"72h 45min"} />
          <CardStatistic label="Total Cubes Solved" total={1233} />
          <CardStatistic label="Sessions in progress" total={"3/12 [392]"} />
          <CardStatistic label="Total Events" total={"4"} />
          <CardStatistic label="Most Played" total={"3x3"} />
          <CardStatistic label="Success Rate" total={"98.8%"} />
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-between items-center mx-auto">
            {cubes && <Doughnut data={data} />}
          </div>
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-center items-center mx-auto">
            {cubes && <AreaChart />}
          </div>
        </div>
        <LastActivity />
      </div>
    </>
  );
}

function LastActivity() {
  return (
    <>
      <div className="border rounded-md border-zinc-800 p-3 w-full text-left sm:text-center">
        <div className="text-xl font-medium mb-3">Last activity</div>
        <div className="text-sm">
          1. 3x3 Weilong 9.59 9 hours ago +4 rating points
        </div>
      </div>
    </>
  );
}

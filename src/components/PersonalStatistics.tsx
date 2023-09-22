import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTimerStore } from "@/store/timerStore";
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
      {" "}
      <div className="flex justify-center max-h-[300px]">
        <div className="">{cubes && <Doughnut data={data} />}</div>
      </div>
      <div className="grow w-full grid grid-cols-1 md:grid-cols-2">
        <CardStatistic label="Total Cubing Time" total={"72h 45min"} />
        <CardStatistic label="Total Solves" total={1233} />
        <CardStatistic label="Total Algorithms" total={1233} />
        <CardStatistic label="Most played" total={"3x3"} />
        <CardStatistic label="Total Solves" total={1233} />
        <CardStatistic label="Total Solves" total={1233} />
      </div>
    </>
  );
}

function CardStatistic({
  label,
  total,
}: {
  label: string;
  total: number | string;
}) {
  return (
    <>
      <div className="border border-zinc-800">
        <div>{label}</div>
        <div>{total}</div>
      </div>
    </>
  );
}

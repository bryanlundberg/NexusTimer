import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import { cubeCollection } from "@/lib/cubeCollection";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryStatistics() {
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
      <div className="flex flex-col gap-3 px-3 py-3">
        <div className="flex gap-3">
          <select className="bg-zinc-900 w-full border rounded-md p-1 border-zinc-800">
            {cubeCollection.map((cube) => (
              <option key={cube.name} value={cube.name}>
                {cube.name}
              </option>
            ))}
          </select>

          <select className="bg-zinc-900 w-full border rounded-md p-1 border-zinc-800">
            <option value="all">All</option>
            <option value="123ds">Weilong</option>
            <option value="wilon">Moulong</option>
            <option value="gan-55">Gan 355</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Total Cubes Solved" total={933} />
          <CardStatistic label="Total Cubes" total={"41"} />
          <CardStatistic label="Most Used Cube" total={"Meilong"} />
          <CardStatistic label="Time Spent Cubing" total={"16h 12min"} />
          <CardStatistic label="Best Time" total={9.91} />
          <CardStatistic label="Best Ao5" total={13.75} />
          <CardStatistic label="Best Ao100" total={15.75} />
          <CardStatistic label="Best Ao1000" total={16.75} />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full md:w-96">
            {cubes && <Doughnut data={data} />}
            <div className="text-2xl font-medium text-center my-3">
              Events distribution
            </div>
          </div>
          <div className="border rounded-md border-zinc-800 p-3 w-full grow overflow-hidden">
            <div className="text-2xl font-medium">Last activity</div>
            <div className="text-md">1. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">2. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">3. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">4. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">5. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">6. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">7. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">8. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">9. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">10. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">1. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">2. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">3. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">4. 3x3 Weilong 9.59 9 hours ago</div>
            <div className="text-md">5. 3x3 Weilong 9.59 9 hours ago</div>
          </div>
        </div>
      </div>
    </>
  );
}

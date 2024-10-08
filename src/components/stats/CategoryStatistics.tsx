import LineCharter from "../charts/LineCharter";
import formatTime from "@/lib/formatTime";
import useMetricsSwitch from "@/hooks/useMetricsSwitch";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { useTimerStore } from "@/store/timerStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function CategoryStatistics() {
  const t = useTranslations("Index");
  const { cubes } = useTimerStore();
  const {
    filterCategory,
    filterCube,
    handleChangeCategory,
    handleChangeCube,
    stats,
  } = useMetricsSwitch();

  return (
    <>
      <div className="flex flex-col gap-3 pt-2 overflow-auto grow">
        <div className="flex gap-3">
          <Select value={filterCategory} onValueChange={handleChangeCategory}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cubeCollection.map((category) => {
                return (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={filterCube} onValueChange={handleChangeCube}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("SolvesPage.all")}</SelectItem>
              {cubes &&
                cubes
                  .filter((cube) => cube.category === filterCategory)
                  .map((item) => {
                    return (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3 md:flex-row ">
          <div className="flex flex-col w-full p-3 border rounded-md h-96 bg-background">
            <LineCharter
              data={stats.data}
              cubeSelected={"all" !== filterCube}
            />
          </div>
        </div>

        <Table className="bg-background rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("StatsPage.global")}</TableHead>
              <TableHead>{t("StatsPage.sessions")}</TableHead>
              <TableHead>C {t("SolvesPage.all")}</TableHead>
              <TableHead>C {t("SolvesPage.session")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t("HomePage.deviation")}</TableCell>
              <TableCell>
                {stats.deviation.global === 0
                  ? "--"
                  : formatTime(stats.deviation.global)}
              </TableCell>
              <TableCell>
                {stats.deviation.session === 0
                  ? "--"
                  : formatTime(stats.deviation.session)}
              </TableCell>
              <TableCell>
                {stats.deviation.cubeAll === 0
                  ? "--"
                  : formatTime(stats.deviation.cubeAll)}
              </TableCell>
              <TableCell>
                {stats.deviation.cubeSession === 0
                  ? "--"
                  : formatTime(stats.deviation.cubeSession)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Ao5</TableCell>
              <TableCell>
                {stats.stats.global.ao5 === 0
                  ? "--"
                  : formatTime(stats.stats.global.ao5)}
              </TableCell>
              <TableCell>
                {stats.stats.session.ao5 === 0
                  ? "--"
                  : formatTime(stats.stats.session.ao5)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeAll.ao5 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeAll.ao5)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeSession.ao5 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeSession.ao5)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Ao12</TableCell>
              <TableCell>
                {stats.stats.global.ao12 === 0
                  ? "--"
                  : formatTime(stats.stats.global.ao12)}
              </TableCell>
              <TableCell>
                {stats.stats.session.ao12 === 0
                  ? "--"
                  : formatTime(stats.stats.session.ao12)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeAll.ao12 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeAll.ao12)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeSession.ao12 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeSession.ao12)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Ao50</TableCell>
              <TableCell>
                {stats.stats.global.ao50 === 0
                  ? "--"
                  : formatTime(stats.stats.global.ao50)}
              </TableCell>
              <TableCell>
                {stats.stats.session.ao50 === 0
                  ? "--"
                  : formatTime(stats.stats.session.ao50)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeAll.ao50 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeAll.ao50)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeSession.ao50 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeSession.ao50)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Ao100</TableCell>
              <TableCell>
                {stats.stats.global.ao100 === 0
                  ? "--"
                  : formatTime(stats.stats.global.ao100)}
              </TableCell>
              <TableCell>
                {stats.stats.session.ao100 === 0
                  ? "--"
                  : formatTime(stats.stats.session.ao100)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeAll.ao100 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeAll.ao100)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeSession.ao100 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeSession.ao100)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Ao1000</TableCell>
              <TableCell>
                {stats.stats.global.ao1000 === 0
                  ? "--"
                  : formatTime(stats.stats.global.ao1000)}
              </TableCell>
              <TableCell>
                {stats.stats.session.ao1000 === 0
                  ? "--"
                  : formatTime(stats.stats.session.ao1000)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeAll.ao1000 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeAll.ao1000)}
              </TableCell>
              <TableCell>
                {stats.stats.cubeSession.ao1000 === 0
                  ? "--"
                  : formatTime(stats.stats.cubeSession.ao1000)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("StatsPage.best-time")}</TableCell>
              <TableCell>
                {stats.best.global > 0 ? formatTime(stats.best.global) : "--"}
              </TableCell>
              <TableCell>
                {stats.best.session > 0 ? formatTime(stats.best.session) : "--"}
              </TableCell>
              <TableCell>
                {stats.best.cubeAll > 0 ? formatTime(stats.best.cubeAll) : "--"}
              </TableCell>
              <TableCell>
                {stats.best.cubeSession > 0
                  ? formatTime(stats.best.cubeSession)
                  : "--"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("StatsPage.average")}</TableCell>
              <TableCell>
                {stats.average.global === 0
                  ? "--"
                  : formatTime(stats.average.global)}
              </TableCell>
              <TableCell>
                {stats.average.session === 0
                  ? "--"
                  : formatTime(stats.average.session)}
              </TableCell>
              <TableCell>
                {stats.average.cubeAll === 0
                  ? "--"
                  : formatTime(stats.average.cubeAll)}
              </TableCell>
              <TableCell>
                {stats.average.cubeSession === 0
                  ? "--"
                  : formatTime(stats.average.cubeSession)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("StatsPage.time-spent")}</TableCell>
              <TableCell>{stats.timeSpent.global}</TableCell>
              <TableCell>{stats.timeSpent.session}</TableCell>
              <TableCell>{stats.timeSpent.cubeAll}</TableCell>
              <TableCell>{stats.timeSpent.cubeSession}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("StatsPage.success-rate")}</TableCell>
              <TableCell>
                {stats.successRate.global === ""
                  ? "--"
                  : stats.successRate.global + "%"}
              </TableCell>
              <TableCell>
                {stats.successRate.session === ""
                  ? "--"
                  : stats.successRate.session + "%"}
              </TableCell>
              <TableCell>
                {stats.successRate.cubeAll === ""
                  ? "--"
                  : stats.successRate.cubeAll + "%"}
              </TableCell>
              <TableCell>
                {stats.successRate.cubeSession === ""
                  ? "--"
                  : stats.successRate.cubeSession + "%"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{t("StatsPage.counter")}</TableCell>
              <TableCell>
                {stats.counter.global === 0 ? "--" : stats.counter.global}
              </TableCell>
              <TableCell>
                {stats.counter.session === 0 ? "--" : stats.counter.session}
              </TableCell>
              <TableCell>
                {stats.counter.cubeAll === 0 ? "--" : stats.counter.cubeAll}
              </TableCell>
              <TableCell>
                {stats.counter.cubeSession === 0
                  ? "--"
                  : stats.counter.cubeSession}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

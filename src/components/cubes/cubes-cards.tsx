import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { GearIcon, HeartFilledIcon, HeartIcon, PlayIcon, StopIcon, TrashIcon } from "@radix-ui/react-icons";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { Cube } from "@/interfaces/Cube";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Solve } from "@/interfaces/Solve";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";

interface CubesCardsProps {
  handleRedirectToTimer: (cubeId: string) => void;
  handleFavoriteClick: (cubeId: string) => void;
  cubes: Cube[];
}

const UsageGraph = ({ allSolves, sessionSolves }: { allSolves: Solve[], sessionSolves: Solve[] }) => {
  const t = useTranslations("Index");
  const locale = useLocale();
  const solves = useMemo(() => {
    const solvesMap = new Map<string, Solve>();

    allSolves.forEach(solve => {
      solvesMap.set(solve.id, solve);
    });

    sessionSolves.forEach(solve => {
      solvesMap.set(solve.id, solve);
    });

    return Array.from(solvesMap.values());
  }, [allSolves, sessionSolves]);


  const chartData = useMemo(() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const allDays: { date: Date, key: string }[] = [];
    const currentDate = new Date(sixMonthsAgo);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    while (currentDate <= today) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      allDays.push({
        date: new Date(currentDate),
        key: dateKey
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const recentSolves = solves.filter(
      (solve) => solve.startTime >= sixMonthsAgo.getTime()
    );

    const solvesByDay = recentSolves.reduce((acc, solve) => {
      const date = new Date(solve.startTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }

      acc[dateKey] += 1;
      return acc;
    }, {} as Record<string, number>);

    return allDays.map(({ date, key }) => {
      const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
      const dayNum = date.getDate();

      return {
        date: key,
        month: `${monthName} ${dayNum}`,
        desktop: solvesByDay[key] || 0
      };
    });
  }, [solves, locale]);

  const chartConfig = {
    desktop: {
      label: t("CubesPage.chart-solves-label"),
      color: "var(--primary)"
    }
  } satisfies ChartConfig;


  if (solves.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-muted-foreground text-xs">
        {t("CubesPage.no-solve-data")}
      </div>
    );
  }

  return (
    <div className="h-16 w-full">
      <ChartContainer config={chartConfig} className="h-full aspect-auto">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
        >
          <CartesianGrid vertical={false} horizontal={false}/>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={false}
            domain={['dataMin', 'dataMax']}
            type="category"
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                hideLabel
                formatter={(value, name, props) => {
                  const dateStr = props.payload.date;
                  if (dateStr) {
                    const [year, month, day] = dateStr.split('-').map(Number);
                    const date = new Date(year, month - 1, day);

                    const formattedDate = new Intl.DateTimeFormat(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }).format(date);

                    return [`#${value} - ${formattedDate}`, ""];
                  }

                  // Fallback to the original format if date parsing fails
                  return [`#${value} - ${props.payload.month}`, ""];
                }}
              />
            }
          />
          <Area
            dataKey="desktop"
            type="monotone"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            isAnimationActive={false}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default function CubesCards({
  handleRedirectToTimer,
  handleFavoriteClick,
  cubes
}: CubesCardsProps) {
  const locale = useLocale();
  const t = useTranslations("Index");
  const { isOpen, type, closeDialog, openDialogType } = useDialogCubesOptions();

  const handleFavoriteClickWithToast = (cubeId: string) => {
    handleFavoriteClick(cubeId);
    const cube = cubes.find(c => c.id === cubeId);
    if (cube) {
      const isFavorite = !cube.favorite;
      toast(isFavorite ? t("CubesPage.marked-as-favorite") : t("CubesPage.removed-from-favorites"), {
        description: cube.name,
        icon: isFavorite ? "❤️" : "🤍",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cubes.map((cube) => (
        <Card key={cube.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle
                className="text-lg cursor-pointer hover:text-primary truncate"
                onClick={() => handleRedirectToTimer(cube.id)}
              >
                {cube.name}
              </CardTitle>
              <Button
                variant={"ghost"}
                onClick={() => handleFavoriteClickWithToast(cube.id)}
                size={"icon"}
                className="h-8 w-8"
              >
                {cube.favorite ? (
                  <HeartFilledIcon className="text-rose-700"/>
                ) : (
                  <HeartIcon/>
                )}
              </Button>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline">{cube.category}</Badge>
              {cube.solves.session.length > 0 ? (
                <div className="flex items-center gap-1 text-xs">
                  <PlayIcon className="h-3 w-3"/>
                  {t("CubesPage.using")}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs">
                  <StopIcon className="h-3 w-3"/>
                  {t("CubesPage.idle")}
                </div>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="text-sm mb-1">
              <span className="text-muted-foreground">{t("CubesPage.created")}: </span>
              {DateTime.fromMillis(cube.createdAt).setLocale(locale).toLocaleString()}
            </div>
            <div className="text-sm mb-3">
              <span className="text-muted-foreground">{t("CubesPage.solves-label")}: </span>
              {cube.solves.session.length}/{cube.solves.all.length} (
              {(() => {
                const uniqueSolveIds = new Set<string>();
                cube.solves.all.forEach(solve => uniqueSolveIds.add(solve.id));
                cube.solves.session.forEach(solve => uniqueSolveIds.add(solve.id));
                return uniqueSolveIds.size;
              })()} {t("CubesPage.total")})
            </div>

            {/* Usage graph */}
            <UsageGraph allSolves={cube.solves.all} sessionSolves={cube.solves.session}/>
          </CardContent>

          <CardFooter className="pt-2">
            <div className="flex w-full items-center justify-between gap-2 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"default"}
                      size={"sm"}
                      onClick={() => handleRedirectToTimer(cube.id)}
                    >
                      <PlayIcon className="mr-1 h-4 w-4"/>
                      Utilize
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Utilize `{cube.name}`</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-2">
                <Dialog open={type === "edit" && isOpen} onOpenChange={closeDialog}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() => {
                            openDialogType({
                              type: "edit",
                              cube: cube
                            });
                          }}
                        >
                          <GearIcon className="mr-1 h-4 w-4"/>
                          {t("CubesPage.edit")}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("CubesPage.edit")} `{cube.name}`</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Dialog>

                <Dialog open={type === "delete" && isOpen} onOpenChange={closeDialog}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() => {
                            openDialogType({
                              type: "delete",
                              cube: cube
                            });
                          }}
                        >
                          <TrashIcon className="mr-1 h-4 w-4"/>
                          {t("CubesPage.delete")}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("CubesPage.delete")} `{cube.name}`</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Dialog>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

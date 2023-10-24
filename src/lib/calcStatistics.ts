import { sort } from "fast-sort";
import calculateBestAo from "./calculateBestAo";
import calculateCurrentAo from "./calculateCurrentAo";
import getDeviation from "./getDeviation";
import getMean from "./getMean";
import getSolvesMetrics from "./getSolvesMetrics";
import { defaultTimerStatistics } from "./const/defaultTimerStatistics";
import { Cube } from "@/interfaces/Cube";

export default function calcStatistics({ cube }: { cube: Cube | null }) {
  if (!cube) {
    return {
      global: defaultTimerStatistics,
      session: defaultTimerStatistics,
      cubeSession: defaultTimerStatistics,
    };
  }

  const { global, session, cubeSession } = getSolvesMetrics(
    cube.category,
    cube.name
  );

  const aoValues: number[] = [3, 5, 12, 50, 100];

  const globalDefault: CubeStatistics = {
    count: 0,
    best: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    deviation: getDeviation(cubeSession),
    mean: getMean(cubeSession),
  };

  const sessionDefault: CubeStatistics = {
    count: 0,
    best: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    deviation: getDeviation(session),
    mean: getMean(session),
  };

  const cubeSessionDefault: CubeStatistics = {
    count: 0,
    best: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    deviation: 0,
    mean: getMean(cubeSession),
  };

  if (session.length > 0) {
    const sessionPB = sort(session).asc((u) => u.time);
    sessionDefault.count = session.length;
    sessionDefault.best = sessionPB[0].time;
    sessionDefault.deviation = getDeviation(session);
    sessionDefault.mean = getMean(session);

    for (const aoValue of aoValues) {
      if (session.length >= aoValue) {
        sessionDefault[`ao${aoValue}` as keyof CubeStatistics] =
          calculateCurrentAo(session, aoValue);
      }
    }
  }

  if (global.length > 0) {
    const globalPB = sort(global).asc((u) => u.time);
    globalDefault.count = global.length;
    globalDefault.best = globalPB[0].time;
    globalDefault.deviation = getDeviation(global);
    globalDefault.mean = getMean(global);

    for (const aoValue of aoValues) {
      if (global.length >= aoValue) {
        globalDefault[`ao${aoValue}` as keyof CubeStatistics] = calculateBestAo(
          global,
          aoValue
        );
      }
    }
  }

  if (cubeSession.length > 0) {
    const cubeSessionPB = sort(cubeSession).asc((u) => u.time);
    cubeSessionDefault.count = cubeSession.length;
    cubeSessionDefault.best = cubeSessionPB[0].time;
    cubeSessionDefault.deviation = getDeviation(cubeSession);
    cubeSessionDefault.mean = getMean(cubeSession);

    for (const aoValue of aoValues) {
      if (cubeSession.length >= aoValue) {
        cubeSessionDefault[`ao${aoValue}` as keyof CubeStatistics] =
          calculateCurrentAo(cubeSession, aoValue);
      }
    }
  }

  return {
    global: globalDefault,
    session: sessionDefault,
    cubeSession: cubeSessionDefault,
  };
}

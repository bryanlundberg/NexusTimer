import { ChartData } from "@/interfaces/ChartData";

export const defaultChartValuesN: StatisticN = {
  global: 0,
  session: 0,
  cubeSession: 0,
  cubeAll: 0,
};

export const defaultChartValuesS: StatisticS = {
  global: "",
  session: "",
  cubeSession: "",
  cubeAll: "",
};

export const defaultChartValuesA: ChartData = {
  global: [],
  session: [],
  cubeSession: [],
  cubeAll: [],
};

export const defaultCharAoValues: AoStatistics = {
  global: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
  },
  session: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
  },
  cubeAll: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
  },
  cubeSession: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
  },
};

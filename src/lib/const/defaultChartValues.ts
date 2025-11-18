import { ChartData } from '@/interfaces/ChartData'
import { StatisticValue, AoStatistics } from '@/shared/types/statistics'

// Valores por defecto tipados con los nuevos generics StatisticValue<T>
export const defaultChartValuesN: StatisticValue<number> = {
  global: 0,
  session: 0,
  cubeSession: 0,
  cubeAll: 0
}

export const defaultChartValuesS: StatisticValue<string> = {
  global: '',
  session: '',
  cubeSession: '',
  cubeAll: ''
}

export const defaultChartValuesA: ChartData = {
  global: [],
  session: [],
  cubeSession: [],
  cubeAll: []
}

export const defaultChartAoValues: AoStatistics = {
  global: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0
  },
  session: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0
  },
  cubeAll: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0
  },
  cubeSession: {
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0
  }
}

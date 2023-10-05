import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import calcPlus2Rate from "./calcPlus2Rate";

export default function calcSuccessRate(
  category: Categories,
  cubeName: string
) {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics(
    category,
    cubeName
  );

  const globalRate = calcPlus2Rate(global);
  const sessionRate = calcPlus2Rate(session);
  const cubeAllRate = calcPlus2Rate(cubeAll);
  const cubeSessionRate = calcPlus2Rate(cubeSession);

  return {
    global: 100 - (globalRate * 100) / global.length || 100,
    session: 100 - (sessionRate * 100) / session.length || 100,
    cubeAll: 100 - (cubeAllRate * 100) / cubeAll.length || 100,
    cubeSession: 100 - (cubeSessionRate * 100) / cubeSession.length || 100,
  };
}

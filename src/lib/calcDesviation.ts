import { Categories } from "@/interfaces/Categories";
import getSolvesMetrics from "./getSolvesMetrics";
import getDesviation from "./getDesviation";

export default function calcDesviation(category: Categories, cubeName: string) {
  const { global, session, cube } = getSolvesMetrics(category, cubeName);

  return {
    global: getDesviation(global),
    session: getDesviation(session),
    cube: getDesviation(cube),
  };
}

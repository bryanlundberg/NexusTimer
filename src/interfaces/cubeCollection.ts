import { Categories } from "./Categories";

type Event =
  | null
  | "222"
  | "333"
  | "444"
  | "555"
  | "666"
  | "777"
  | "333bf"
  | "333fm"
  | "333oh"
  | "clock"
  | "minx"
  | "pyram"
  | "skewb"
  | "sq1"
  | "444bf"
  | "555bf"
  | "333mbf"
  | "333ft";

export interface CubeCollection {
  event: Event;
  id: number;
  name: Categories;
  src: any;
}

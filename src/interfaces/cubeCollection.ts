import { PuzzleID } from "cubing/twisty";
import { Categories } from "./Categories";

export type Event =
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

type TwistyTimerEvent =
  | "222"
  | "333"
  | "444"
  | "555"
  | "666"
  | "777"
  | "skewb"
  | "mega"
  | "pyra"
  | "sq1"
  | "clock";

export interface CubeCollection {
  event: Event;
  id: number;
  name: Categories;
  src: any;
  displayId: PuzzleID;
  twistyId: TwistyTimerEvent;
}

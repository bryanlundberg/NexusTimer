import { Scrambow } from "scrambow";
import { cubeCollection } from "../const/cubeCollection";

export default function genScramble(category) {
  const eventId = cubeCollection.find((cube) => cube.name === category);
  if (!eventId) {
    return "Error: Scrambler not available for this category.";
  }
  const scramble = new Scrambow(eventId.event);
  const newScramble = scramble.get(1);
  return newScramble[0].scramble_string;
}

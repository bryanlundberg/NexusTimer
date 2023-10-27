import { Scrambow } from "scrambow";

export default function genScramble(category) {
  const scramble = new Scrambow(category);
  const newScramble = scramble.get(1);
  return newScramble[0].scramble_string;
}

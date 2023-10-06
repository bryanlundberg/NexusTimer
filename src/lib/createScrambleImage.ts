export default function createScrambleImage(event: string, scramble: string) {
  const display = document.querySelector("scramble-display");
  display?.remove();
  const child = document.createElement("scramble-display");
  child.setAttribute("event", event);
  child.setAttribute("scramble", scramble ? scramble : "");
  document.querySelector("#scramble-display")?.appendChild(child);
}

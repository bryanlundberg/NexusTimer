import { FAKE_SESSION } from "../data/FAKE_SESSION";
import getWorstTime from "../src/lib/getWorstTime";

describe("getWorstTime Function Tests", () => {
  test("Empty array", () => {
    expect(getWorstTime([])).toBe(0);
  });

  test("Array with multiple solves", () => {
    expect(getWorstTime([...FAKE_SESSION])).toBe(16711);
  });
});

import { FAKE_SESSION } from "../data/FAKE_SESSION";
import getWorstTime from "../src/lib/getWorstTime";

describe("getWorstTime Function Tests", () => {
  test("should return 0 when passing an empty array", () => {
    expect(getWorstTime([])).toBe(0);
  });

  test("should return the highest solve time from the session", () => {
    expect(getWorstTime([...FAKE_SESSION])).toBe(16711);
  });
});

import getMean from "../src/lib/getMean";
import { FAKE_SESSION } from "../data/FAKE_SESSION";

describe("getMean Function Tests", () => {
  test("should return 0 for an empty array", () => {
    expect(getMean([])).toBe(0);
  });

  test("should calculate the mean for a full session with a range of values", () => {
    expect(getMean([...FAKE_SESSION])).toBe(13658.98076923077);
  });

  test("should calculate the mean for the first 5 solves in the session", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 5))).toBe(13861.6);
  });

  test("should calculate the mean for the first 12 solves in the session", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 12))).toBe(14646.666666666666);
  });

  test("should calculate the mean for the first 50 solves in the session", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 50))).toBe(13738.22);
  });

  test("should return 0 when the function is called without parameters", () => {
    expect(getMean()).toBe(0);
  });

  test("should return 0 when a string is passed as the parameter", () => {
    expect(getMean("string")).toBe(0);
  });

  test("should return 0 when a number is passed as the parameter", () => {
    expect(getMean(123)).toBe(0);
  });

  test("should return 0 when null is passed as the parameter", () => {
    expect(getMean(null)).toBe(0);
  });

  test("should return 0 when undefined is passed as the parameter", () => {
    expect(getMean(undefined)).toBe(0);
  });
});

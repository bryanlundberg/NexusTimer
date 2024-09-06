import getDeviation from "../src/lib/getDeviation";
import { FAKE_SESSION } from "../data/FAKE_SESSION";

describe("Should get the deviation standard from an array of solves", () => {
  test("Passing an empty array", () => {
    expect(getDeviation([])).toBe(0);
  });

  test("Passing a full session", () => {
    expect(getDeviation([...FAKE_SESSION])).toBe(1432.117977536666);
  });

  test("Deviation of 5 values", () => {
    expect(getDeviation([...FAKE_SESSION].slice(0, 5))).toBe(1217.350113977076);
  });

  test("Deviation of 12 values", () => {
    expect(getDeviation([...FAKE_SESSION].slice(0, 12))).toBe(
      1403.2537730272281
    );
  });

  test("Deviation of 50 values", () => {
    expect(getDeviation([...FAKE_SESSION].slice(0, 50))).toBe(
      1390.4659076756118
    );
  });

  test("without parameters", () => {
    expect(getDeviation()).toBe(0);
  });

  test("passing undefined value as parameter", () => {
    expect(getDeviation(undefined)).toBe(0);
  });

  test("passing null value as parameter", () => {
    expect(getDeviation(null)).toBe(0);
  });

  test("passing string value as parameter", () => {
    expect(getDeviation("string")).toBe(0);
  });

  test("passing number value as parameter", () => {
    expect(getDeviation(34)).toBe(0);
  });
});

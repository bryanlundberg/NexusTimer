import getMean from "../src/lib/getMean";
import { FAKE_SESSION } from "../data/FAKE_SESSION";

describe("Should get the mean from an array of solves", () => {
  test("Empty array", () => {
    expect(getMean([])).toBe(0);
  });

  test("Full session, undetermined range of values", () => {
    expect(getMean([...FAKE_SESSION])).toBe(13658.98076923077);
  });

  test("Session, 5 values", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 5))).toBe(13861.6);
  });

  test("Session, 12 values", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 12))).toBe(14646.666666666666);
  });

  test("Session, 50 values", () => {
    expect(getMean([...FAKE_SESSION].slice(0, 50))).toBe(13738.22);
  });

  test("Empty usage of the function", () => {
    expect(getMean()).toBe(0);
  });

  test("Passing a string as parameter", () => {
    expect(getMean("string")).toBe(0);
  });

  test("Passing a number as parameter", () => {
    expect(getMean(123)).toBe(0);
  });

  test("Passing a null as parameter", () => {
    expect(getMean(null)).toBe(0);
  });

  test("Passing a undefined as parameter", () => {
    expect(getMean(undefined)).toBe(0);
  });
});

import calculateCurrentAo from "../src/lib/calculateCurrentAo";
import { FAKE_SESSION } from "../data/FAKE_SESSION";

describe("calculateCurrentAo Function Tests", () => {
  test("should return 0 if the number of solves is less than the desired average length (ao)", () => {
    const ao = 5;
    const limitedSolves = FAKE_SESSION.slice(0, 4);
    expect(calculateCurrentAo(limitedSolves, ao)).toBe(0);
  });

  test("should return the correct average when the number of solves equals the desired average length (ao)", () => {
    const ao = 5;
    const solves = FAKE_SESSION.slice(0, 5);
    expect(calculateCurrentAo(solves, ao)).toBe(14126.333333333334);
  });

  test("should return the correct average when the number of solves is greater than the desired average length (ao)", () => {
    const ao = 5;
    const solves = FAKE_SESSION.slice(0, 7);
    expect(calculateCurrentAo(solves, ao)).toBe(14126.333333333334);
  });

  test("should handle ao of 1 (should return 0 as there's no valid average)", () => {
    const ao = 1;
    const solves = FAKE_SESSION.slice(0, 1);
    expect(calculateCurrentAo(solves, ao)).toBe(0);
  });

  test("should handle ao of 2 (should return 0 as there's no valid average)", () => {
    const ao = 2;
    const solves = FAKE_SESSION.slice(0, 2);
    expect(calculateCurrentAo(solves, ao)).toBe(0);
  });

  test("should handle ao of 3 (should return the middle solve time)", () => {
    const ao = 3;
    const solves = FAKE_SESSION.slice(0, 3).sort((a, b) => a.time - b.time);
    const expectedAverage = solves[1].time;
    expect(calculateCurrentAo(solves, ao)).toBe(expectedAverage);
  });

  test("should handle empty solve array", () => {
    const ao = 5;
    const emptySolves = [];
    expect(calculateCurrentAo(emptySolves, ao)).toBe(0);
  });

  test("should handle non-positive 'ao' values (0 or negative)", () => {
    const solves = FAKE_SESSION.slice(0, 5);
    expect(calculateCurrentAo(solves, 0)).toBe(0);
    expect(calculateCurrentAo(solves, -3)).toBe(0);
  });
});

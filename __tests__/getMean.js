import getMean from "../src/lib/getMean";
import { FAKE_SESSION } from "../data/FAKE_SESSION";

test("Should get the mean from an array of solves", () => {
  expect(getMean([])).toBe(0);
  expect(getMean([...FAKE_SESSION])).toBe(13658.98076923077);
  expect(getMean([...FAKE_SESSION].slice(0, 5))).toBe(13861.6);
  expect(getMean([...FAKE_SESSION].slice(5, 12))).toBe(15207.42857142857);
  expect(getMean([...FAKE_SESSION].slice(0, 12))).toBe(14646.666666666666);
  expect(getMean([...FAKE_SESSION].slice(0, 50))).toBe(13738.22);
  expect(getMean()).toBe(0);
});

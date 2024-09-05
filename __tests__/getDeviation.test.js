// import { FAKE_SESSION } from "./session";
import getDeviation from "../src/lib/getDeviation";
import { FAKE_SESSION } from "../data/FAKE_SESSION";
test("Should get the deviation standard from an array of solves", () => {
  expect(getDeviation([])).toBe(0);
  expect(getDeviation([...FAKE_SESSION])).toBe(1432.117977536666);
  expect(getDeviation([...FAKE_SESSION].slice(0, 5))).toBe(1217.350113977076);
  expect(getDeviation([...FAKE_SESSION].slice(5, 12))).toBe(1319.705883539063);
  expect(getDeviation([...FAKE_SESSION].slice(0, 12))).toBe(1403.2537730272281);
  expect(getDeviation([...FAKE_SESSION].slice(0, 30))).toBe(1373.9241429477513);
});

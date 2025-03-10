import { expect, test } from "vitest";
import {intersect} from './src/libs/math/intersection'

test("intersect", () => {
  const tm = intersect([2, 4], [1, 3]);
  expect(tm).toBe(true);
});

test("no intersect", () => {
  const tm = intersect([2, 4], [5, 10]);
  expect(tm).toBe(false);
});


test("intersect with negative value", () => {
  const tm = intersect([-4, 4], [-1, 10]);
  expect(tm).toBe(true);
});

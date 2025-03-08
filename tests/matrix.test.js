import { expect, test } from "vitest";
import {
  translateMatrix,
  scaleMatrix,
  multiplyMatrix3D,
} from "../src/libs/math/matrix";

test("check translate matrix generation", () => {
  const tm = translateMatrix(2, 4);
  expect(tm[3]).toBe(2);
});

test("check scale matrix generation", () => {
  const sm = scaleMatrix(2, 5);
  expect(sm[0]).toBe(2);
});

test("matrix multiplication", () => {
  const tm = translateMatrix(2, 5);
  const sm = scaleMatrix(5, 1);
  const result = multiplyMatrix3D(tm, sm);
  expect(result[3]).toBe(10);
});

export type TMatrix3D = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/**
 * Generate a translate matrix
 * @param tx delta x value
 * @param ty delta y value
 * @returns translate matrix
 */
export const translateMatrix = (tx: number, ty: number): TMatrix3D => {
  return [1, 0, 0, tx, 0, 1, 0, ty, 0, 0, 0, 0, 0, 0, 0, 1];
};

/**
 * Generate a scale matrix
 * @param tx delta x value
 * @param ty delta y value
 * @returns scale matrix
 */
export const scaleMatrix = (sx: number, sy: number): TMatrix3D => {
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
};

/**
 * Multiply matrix. IMPORTANT - order in argument has importance
 * @param first first matrix
 * @param second second matrix
 * @returns matrix of move
 */
export const multiplyMatrix3D = (
  first: TMatrix3D,
  second: TMatrix3D,
): TMatrix3D => {
  const result: TMatrix3D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      for (let k = 0; k < 4; k++) {
        result[index] += second[i * 4 + k] * first[k * 4 + j];
      }
    }
  }
  return result;
};

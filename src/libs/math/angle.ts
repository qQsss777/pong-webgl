/**
 * Calculate angle in cartesian plan
 * @param start mininum value for angle
 * @param end maximum value for angle
 * @returns angle in cartesian plan
 */
export const generateRandomNumber = (start: number, end: number): number => {
  return Math.floor(Math.random() * (start - end + 1) + end) - 90;
};

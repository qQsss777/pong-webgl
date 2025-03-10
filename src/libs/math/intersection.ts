/**
 * Cchek if vector intersect other vector
 * @param vectorA vecteur A
 * @param vectorB vecteur B
 * @returns
 */
export const intersect = (
  vectorA: [number, number],
  vectorB: [number, number],
): boolean => {
  let intersect = false;
  for (const v of vectorA) {
    if (v >= vectorB[0] && vectorB[1] >= v) {
      intersect = true;
      break;
    }
  }
  return intersect;
};

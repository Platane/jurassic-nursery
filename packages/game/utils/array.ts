/**
 * pick the first n maximal indexes
 */
export const pickMaxIndices = (arr: ArrayLike<number>, n: number) => {
  const max_is = Array.from({ length: n }, (_, i) => i);
  max_is.sort((a, b) => arr[a] - arr[b]);

  for (let i = n; i < arr.length; i++) {
    if (arr[max_is[0]] < arr[i]) {
      max_is[0] = i;
      max_is.sort((a, b) => arr[a] - arr[b]);
    }
  }

  return max_is.reverse();
};

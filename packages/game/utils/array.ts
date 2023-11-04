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

export const pickMinIndices = (arr: ArrayLike<number>, n: number) => {
  const max_is = Array.from({ length: n }, (_, i) => i);
  max_is.sort((a, b) => arr[b] - arr[a]);

  for (let i = n; i < arr.length; i++) {
    if (arr[max_is[0]] > arr[i]) {
      max_is[0] = i;
      max_is.sort((a, b) => arr[b] - arr[a]);
    }
  }

  return max_is.reverse();
};

/**
 * shuffle an array in place
 */
export const shuffleArray = <T>(array: T[], random = Math.random) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

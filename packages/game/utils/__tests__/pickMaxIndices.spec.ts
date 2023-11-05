import assert from "node:assert";
import { pickMaxIndices } from "../array";

// @ts-ignore
import { test } from "bun:test";

test("should pick max indices", () => {
  const arr = Array.from({ length: 200 }, () => Math.random());

  const is = pickMaxIndices(arr, 4);

  assert.deepEqual(
    arr.slice().sort().reverse().slice(0, 4),
    is.map((i) => arr[i]),
  );
});

import { createGeometry } from "./renderer/materials/basic/geometry";
import { css } from "@linaria/core";

console.log("hello");

createGeometry().then(console.log);

console.log(css`
  color: red;

  display: flex;
`);

css`
  :global() {
    body {
      margin: 0;

      font-family: Verdana, sans-serif;
    }

    * {
      box-sizing: border-box;
    }
  }
`;

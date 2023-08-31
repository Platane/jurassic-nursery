import { css } from "@linaria/core";

css`
  :global() {
    body {
      margin: 0;

      color: orange;

      font-family: Verdana, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    canvas {
      position: fixed;
    }
  }
`;

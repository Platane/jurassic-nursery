import { css } from "@linaria/core";

css`
  :global() {
    html,
    body {
      touch-action: none;
      background-color: #f9f8ea;
      margin: 0;
    }

    canvas {
      position: fixed;
      width: 100%;
      height: 100%;
    }
  }
`;

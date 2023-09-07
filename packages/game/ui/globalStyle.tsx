import { css } from "@linaria/core";

css`
  :global() {
    html,
    body {
      touch-action: none;
    }

    html {
      font-family: Verdana, sans-serif;
      background-color: #f9f8ea;
    }

    body {
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    canvas {
      position: fixed;
      width: 100%;
      height: 100%;
    }
  }
`;

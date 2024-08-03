import { Hello } from "di-ui.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${Hello()}
`;

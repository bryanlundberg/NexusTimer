import { changeTheme } from "../toggle/toggle-theme.js";

export const settingsPage = () => {
  const theme = document.querySelector("#theme");
  theme.addEventListener("change", changeTheme);
};
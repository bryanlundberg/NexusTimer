import { changeTheme } from "../toggle/change-theme.js";

export const settingsPage = () => {
	const theme = document.querySelector("#theme")
	theme.addEventListener("change", changeTheme);
}
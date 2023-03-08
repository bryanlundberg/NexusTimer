import { profilePage } from "./modules/page/profile-page.js";
import { timerPage } from "./modules/page/timer-page.js";
import { settingsPage } from "./modules/page/settings-page.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;
  if (currentUrl.includes("/timer")) {
    timerPage();
  } else if (currentUrl.includes("/settings")) {
    settingsPage();
  } else {
    profilePage();
  }
});

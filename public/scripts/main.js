//falta añadir metas semanales en el perfil tambien si se me olvida deje un buen dashboard de eejmplo en los pin de chrome
import { setNewScramble } from "./modules/scramble/scramble-generator.js";
import { handleDownKeys, handleUpKeys } from "./modules/timer/handle-keys.js";
import { generateStatistics } from "./modules/api/fetch-statistics.js";
import { fillGraphs } from "./modules/graph/graphs.js";

const currentUrl = window.location.href;

if (currentUrl.includes('/timer')) {
	
  document.querySelector("#category").addEventListener("input", setNewScramble);
  document.querySelector("#category").addEventListener("input", generateStatistics);
  document.addEventListener("keydown", handleDownKeys);
  document.addEventListener("keyup", handleUpKeys);
  
} else if (currentUrl.includes('/profile')) {
  const a = document.querySelector("#myChart2")
  if (a) {document.addEventListener("DOMContentLoaded", fillGraphs);}
}
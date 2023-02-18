//falta añadir metas semanales en el perfil tambien si se me olvida deje un buen dashboard de eejmplo en los pin de chrome
import { setNewScramble } from "./modules/scramble/scramble-generator.js";
import { handleDownKeys, handleUpKeys } from "./modules/timer/handle-keys.js";
import { generateStatistics } from "./modules/api/fetch-statistics.js";
import { updateStatisticsProfileChart, categoryFilter, cubeFilter , generateOptionList } from "./modules/graph/graphs.js";
import { toggleActiveNavBar } from "./modules/toggle/toggle.js";


document.addEventListener("DOMContentLoaded", (e) => {
	
	const currentUrl = window.location.href;

	if (currentUrl.includes('/timer')) {
		
	  document.querySelector("#category").addEventListener("input", setNewScramble);
	  document.querySelector("#category").addEventListener("input", generateStatistics);
	  document.addEventListener("keydown", handleDownKeys);
	  document.addEventListener("keyup", handleUpKeys);
	  
	} else if (currentUrl.includes('/profile')) {
		toggleActiveNavBar()
		const categoryFilter = document.querySelector("#category-filter");
		const cubeFilter = document.querySelector("#cube-filter");

	  if (categoryFilter) {
		  const cube = document.querySelector("#cube-filter");
		  cube.setAttribute("disabled", true);
		  generateOptionList();
		  updateStatisticsProfileChart();
		  categoryFilter.addEventListener("change", categoryFilter)
		  cubeFilter.addEventListener("change", cubeFilter)
		  
	  }
	}
	
});



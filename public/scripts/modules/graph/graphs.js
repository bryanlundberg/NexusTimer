import { fetchProfileStats, fetchProfileFilters } from "../api/fetch-profile-stats.js";
import { convertMStoDHMS } from "../utils/time-converter.js";
export async function updateStatisticsProfileChart() {
	try {
		generateValidListOptions()
		
		const category = document.querySelector("#category-filter").value
		const cube = document.querySelector("#cube-filter").value
		const userStat = await fetchProfileStats(category,cube);
		
		const solvingTime = document.querySelector("#solving-time").textContent = convertMStoDHMS(userStat.solvingTime)
		const pb = document.querySelector("#best-time").textContent = userStat.pb
		const avg = document.querySelector("#mean").textContent = userStat.avg
		const result5 = document.querySelector("#best-ao5").textContent = userStat.result5
		const result12 = document.querySelector("#best-ao12").textContent = userStat.result12
		const result50 = document.querySelector("#best-ao50").textContent = userStat.result50
		const result100 = document.querySelector("#best-ao100").textContent = userStat.result100
		const result1000 = document.querySelector("#best-ao1000").textContent = userStat.result1000
		const desviation = document.querySelector("#desviation").textContent = userStat.desviation
		const solvesCount = document.querySelector("#count").textContent = userStat.solvesCount
		
		
	} catch (err) {
		console.log(err)
	}
}



async function generateValidListOptions() {
	
	try {
		
	  console.log("blockInvalidListOptions called");
	  const category = document.querySelector("#category-filter");
	  const cube = document.querySelector("#cube-filter");
	  console.log(cube.value);
	  
	  const filter = await fetchProfileFilters();
	  if (!filter) { throw new Error("error al obtener filtros")}
	  
	  if (category.value.toLowerCase() === "overall" && cube.value.toLowerCase() === "overall") {
		cube.setAttribute("disabled", true);
		
		clearFilterCategory()

		filter.categories.forEach(element => { 
			const newOptionCategory = document.createElement("option");
			newOptionCategory.setAttribute("value", element);
			newOptionCategory.textContent = element;
			category.appendChild(newOptionCategory);
		})
		
		return;

	  } 
	  
	  if (category.value.toLowerCase() !== "overall") {
		cube.removeAttribute("disabled");

		clearFilterCube()

		filter.cubes.forEach(element => { 
			if (element.category === category.value) {
				const newOptionCube = document.createElement("option");
				newOptionCube.setAttribute("value", element._id);
				newOptionCube.textContent = element.name + " | " + element.category;
				cube.appendChild(newOptionCube);
				
			}

		})
		
		return;
	  }
	  
	  

	  console.log(filter)
	} catch (error) {
		console.log(error)
	}
}
function clearFilterCategory() {
	const category = document.querySelector("#category-filter");
		while (category.firstChild) {
			category.removeChild(category.firstChild);
		}
		const defaultOptionCategory = document.createElement("option")
		defaultOptionCategory.setAttribute("value", "overall");
		defaultOptionCategory.textContent = "Overall";
		category.appendChild(defaultOptionCategory);
}

function clearFilterCube() {
	  
	 const cube = document.querySelector("#cube-filter");
	
	while (cube.firstChild) {
		cube.removeChild(cube.firstChild);
	}

	const defaultOptionCube = document.createElement("option")
	defaultOptionCube.setAttribute("value", "overall");
	defaultOptionCube.textContent = "Overall";
	cube.appendChild(defaultOptionCube);	
}



/* function generateValidListOptions() {
  const category = document.querySelector("#category-filter").value;
  const cube = document.querySelector("#cube-filter");

  const indexMidReference = cube.value.indexOf("|");

  const selectedCubes = cube.querySelectorAll("option");
  console.log(selectedCubes);

  for (let i = 0; i < selectedCubes.length; i++) {
    const optionValue = selectedCubes[i].textContent;
    if (optionValue !== "overall" && optionValue.indexOf("|") !== -1) {
      const cubeName = optionValue.split("|")[1].trim();
      if (cubeName && cubeName === category) {
        // Opción válida, no se elimina
      } else {
        selectedCubes[i].remove();
      }
    }
  }
} */




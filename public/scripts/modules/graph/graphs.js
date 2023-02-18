import { fetchProfileStats, fetchProfileFilters } from "../api/fetch-profile-stats.js";
import { convertMStoDHMS } from "../utils/time-converter.js";

let selectedCubeTemporal = document.querySelector("#category-filter").value;
let selectedCategoryTemporal = document.querySelector("#cube-filter").value;
let filter;
console.log(selectedCategoryTemporal)


export async function updateStatisticsProfileChart() {
	try {
		filter = await fetchProfileFilters();
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

export async function categoryFilter() {
	try {
    
		const category = document.querySelector("#category-filter");
		const cube = document.querySelector("#cube-filter");
		selectedCategoryTemporal = category.value;
		selectedCubeTemporal = cube.value;
		
		if (selectedCategoryTemporal === "overall" && selectedCubeTemporal === "overall") {
		  cube.setAttribute("disabled", true);

		  clearFilterCategory();
		  clearFilterCube();

		  filter.categories.forEach((element) => {
			const newOptionCategory = document.createElement("option");
			newOptionCategory.setAttribute("value", element);
			newOptionCategory.textContent = element;
			category.appendChild(newOptionCategory);
		  });
		  
		  console.log("1");

		  return;
		} else if (selectedCategoryTemporal === "overall" && selectedCubeTemporal !== "overall") {
		  cube.setAttribute("disabled", true);

		  clearFilterCategory();
		  clearFilterCube();

		  filter.categories.forEach((element) => {
			const newOptionCategory = document.createElement("option");
			newOptionCategory.setAttribute("value", element);
			newOptionCategory.textContent = element;
			category.appendChild(newOptionCategory);
		  });
	console.log("2");
		  return;
		} else if (selectedCategoryTemporal !== "overall" && selectedCubeTemporal === "overall") {
		  cube.removeAttribute("disabled");

		  clearFilterCube();

		  filter.cubes.forEach((element) => {
			if (element.category === category.value) {
			  const newOptionCube = document.createElement("option");
			  newOptionCube.setAttribute("value", element._id);
			  newOptionCube.textContent = element.name + " | " + element.category;
			  cube.appendChild(newOptionCube);
			}
		  });
	console.log("3");
		  return;
		} else if (selectedCategoryTemporal !== "overall" && selectedCubeTemporal !== "overall") {
		  cube.removeAttribute("disabled");
		  // Desmenuzar y comparar las categorías
		  const categoryText = category.options[category.selectedIndex].textContent;
		  const cubeText = cube.options[cube.selectedIndex].textContent;
		  const categoryParts = categoryText.split(" | ");
		  const cubeParts = cubeText.split(" | ");
		  if (categoryParts[1] !== cubeParts[1]) {
			clearFilterCategory();
			clearFilterCube();
			return;
		  }

		  console.log("4");
		  return;
		}
		
	} catch (error) {
		
		
	}
}

export async function cubeFilter() {
	try {
		
		
	} catch (error) {
		
		
	}
}

export async function generateOptionList() {
  try {
    
    const category = document.querySelector("#category-filter");
    const cube = document.querySelector("#cube-filter");
	selectedCategory = category.value;
	selectedCube = cube.value;
	
    if (selectedCategory === "overall" && selectedCube === "overall") {
      cube.setAttribute("disabled", true);

      clearFilterCategory();
      clearFilterCube();

      filter.categories.forEach((element) => {
        const newOptionCategory = document.createElement("option");
        newOptionCategory.setAttribute("value", element);
        newOptionCategory.textContent = element;
        category.appendChild(newOptionCategory);
      });
	  
	  console.log("1");
    } 
  } catch (error) {
    console.log(error);
  }
}

function clearFilterCategory() {
  const category = document.querySelector("#category-filter");
  while (category.firstChild) {
    category.removeChild(category.firstChild);
  }
  const defaultOptionCategory = document.createElement("option");
  defaultOptionCategory.setAttribute("value", "overall");
  defaultOptionCategory.textContent = "Overall";
  category.appendChild(defaultOptionCategory);
}

function clearFilterCube() {
  const cube = document.querySelector("#cube-filter");

  while (cube.firstChild) {
    cube.removeChild(cube.firstChild);
  }

  const defaultOptionCube = document.createElement("option");
  defaultOptionCube.setAttribute("value", "overall");
  defaultOptionCube.textContent = "Overall";
  cube.appendChild(defaultOptionCube);
}
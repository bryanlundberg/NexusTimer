import { fetchProfileStats, fetchProfileFilters } from "../api/fetch-profile-stats.js";
import { convertMStoDHMS } from "../utils/time-converter.js";
import { categories } from "../utils/categories.js";

let filter;
let currentCategory = "overall";
export async function updateStatisticsProfileChart() {
	try {
		filter = await fetchProfileFilters();
		console.log(filter)
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

export async function categoryFilterGen() {
	try {
		const cube = document.querySelector("#cube-filter");
		const category = document.querySelector("#category-filter");
		
		if (category.value.toLowerCase() === "overall") {
			clearFilterCategory();
			clearFilterCube();
			cube.setAttribute("disabled", true);
			generateCategoryList();
			//set default overall
			const defaultOverall = document.createElement("option");
			defaultOverall.setAttribute("value", "overall");
			defaultOverall.textContent = "Overall";
			cube.appendChild(defaultOverall);
			console.log("1")
		}
		
		if (category.value.toLowerCase() !== "overall") {
			console.log(category.value, currentCategory)
			if (category.value.toLowerCase() !== currentCategory) {
				currentCategory = category.value.toLowerCase();
				clearFilterCube();
				console.log("algo")
			}
			cube.removeAttribute("disabled");
			await generateCubesOptions();
			console.log("2")
		}
	} catch (error) {
		console.log(error);
	}
}

export async function cubeFilterGen() {
	try {
		
		
	} catch (error) {
		
		console.log(error)
	}
}

async function generateCubesOptions() {
	try {
		const category = document.querySelector("#category-filter");
		const cube = document.querySelector("#cube-filter");
		console.log("pase")
		
		if (category.value.toLowerCase() === "overall") return;
		
		
		const defaultOverall = document.createElement("option");
		defaultOverall.setAttribute("value", "overall");
		defaultOverall.textContent = "Overall";
		cube.appendChild(defaultOverall);
		
		filter.cubes.forEach((element) => {
			if (element.category === currentCategory) {
				const newOptionCube = document.createElement("option");
				newOptionCube.setAttribute("value", element._id);
				newOptionCube.textContent = element.name + " | " + element.category;
				cube.appendChild(newOptionCube);
			}
		});
	} catch (error) {
		console.log(error);
	}
}

export async function generateCategoryList() {
  try {
    const category = document.querySelector("#category-filter");
	if (!category) { throw new Error("Fallo encontrnado category filter")}
	categories.forEach(element => {
		const optionElement = document.createElement("option");
		optionElement.textContent = element.cat;
		optionElement.value = element.cat;
		category.appendChild(optionElement)
	})
    
  } catch (error) {
    console.log(error);
  }
}

function clearFilterCategory() {
  const category = document.querySelector("#category-filter");
  while (category.firstChild) {
    category.removeChild(category.firstChild);
  }
}

function clearFilterCube() {
  const cube = document.querySelector("#cube-filter");
  while (cube.firstChild) {
    cube.removeChild(cube.firstChild);
  }
}
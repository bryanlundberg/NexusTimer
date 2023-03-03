import { setScramble } from "../scramble/scramble-generator.js";
import { handleDownKeys, handleUpKeys } from "../timer/handle-keys.js";
import { getUserById, getUserCategoryStatistics } from "../api/fetch-get.js";
import { deleteChilds } from "../utils/functions.js";

export let user;
let selectedCategory;
let selectedCube;

export const timerPage = async () => {
	
	const userId = document.querySelector("input[name=id]").value;
	user = await getUserById(userId);
	
	generateInitialFilters();
	setScramble()
	updateDisplayTimerStats()

  const categoryList = document.querySelector("#category");
  const cubeList = document.querySelector("#cube");
	
  categoryList.addEventListener("change", executeCategoryListChange);
  cubeList.addEventListener("change", executeCubeListChange);
	
  document.addEventListener("keydown", handleDownKeys);
  document.addEventListener("keyup", handleUpKeys);
	
};

const executeCategoryListChange = () => {
	toggleCategoryFilter()
	setScramble()
	updateDisplayTimerStats()
}

const executeCubeListChange = () => {
	toggleCubeFilter()
	setScramble()
	updateDisplayTimerStats()
}

export const updateDisplayTimerStats = async () => {
  try {
    const currentCategory = document.querySelector("#category option");
    const userId = document.querySelector("input[name=id]").value;

    if (currentCategory) {
      const userStats = await getUserCategoryStatistics(
        userId,
        currentCategory.value
      );

      const count = document.querySelector("#count");
      const bestTime = document.querySelector("#pb");
      const avg5 = document.querySelector("#avg5");
      const avg12 = document.querySelector("#avg12");
      const avg50 = document.querySelector("#avg50");
      const desviation = document.querySelector("#desviation");
      const average = document.querySelector("#avg");

      count.textContent = userStats.counter;
      avg5.textContent = userStats.avg5;
      avg12.textContent = userStats.avg12;
      avg50.textContent = userStats.avg50;
      desviation.textContent = userStats.desviation;
      average.textContent = userStats.avg;
      bestTime.textContent = userStats.pb;
    }
  } catch (error) {
    console.log(error);
  }
};

const generateInitialFilters = () => {
	const categoryList = document.querySelector("#category");
  const cubeList = document.querySelector("#cube");
	
  if (user.categories.length === -1) {
    const scrambleArea = document.querySelector("#scramble");
    scrambleArea.textContent = "Before start cubing add a cube to your account";
    return;
  }
	
  deleteChilds("category");
  deleteChilds("cube");


  user.categories.forEach((element) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = element;
    categoryOption.textContent = element;
    categoryList.appendChild(categoryOption);
  });
	
	selectedCategory = document.querySelector("#category").value;
	
  user.cubes.forEach((element) => {
		if (element.category == selectedCategory) {
			const cubeOption = document.createElement("option");
			cubeOption.value = element._id;
			cubeOption.textContent = element.name + " | " + element.category;
			cubeList.appendChild(cubeOption);
		}
  });

};

const toggleCategoryFilter = () => {
	
  const categoryList = document.querySelector("#category");
  const cubeList = document.querySelector("#cube");
	
	selectedCategory = document.querySelector("#category").value;
	
	deleteChilds("cube");
  user.cubes.forEach((element) => {
		if (element.category == selectedCategory) {
			const cubeOption = document.createElement("option");
			cubeOption.value = element._id;
			cubeOption.textContent = element.name + "|" + element.category;
			cubeList.appendChild(cubeOption);
		}
  });
	
}

const toggleCubeFilter = () => {
	
}
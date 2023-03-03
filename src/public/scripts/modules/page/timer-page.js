import { setNewScramble } from "../scramble/scramble-generator.js";
import { handleDownKeys, handleUpKeys } from "../timer/handle-keys.js";
import { generateStatistics } from "../api/fetch-statistics.js";

export let user;
let selectedCategory;
let selectedCube;

export const timerPage = async () => {
	
	user = await getUser();
	generateInitialFilters();
	
  const categoryList = document.querySelector("#category");
  const cubeList = document.querySelector("#cube");
	
  categoryList.addEventListener("change", executeCategoryListChange);
  cubeList.addEventListener("change", executeCubeListChange);
  document.addEventListener("keydown", handleDownKeys);
  document.addEventListener("keyup", handleUpKeys);
	
};

const executeCategoryListChange = () => {
	toggleCategoryFilter()
	setNewScramble()
	generateStatistics()
	
}

const executeCubeListChange = () => {
	toggleCubeFilter()
	setNewScramble()
	generateStatistics()
}

const getUser = async () => {
	try {
		const userId = document.querySelector("input[name=id]").value;
		const getUserData = await fetch(`http://localhost:3000/api/${userId}`);
		const data = await getUserData.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}


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
			cubeOption.textContent = element.name + "|" + element.category;
			cubeList.appendChild(cubeOption);
		}
  });

};

const deleteChilds = (idParent) => {
  const parentTag = document.querySelector(`#${idParent}`);
  if (!parentTag) {
    console.log("Parent #id Not Found");
		return;
  }
  while (parentTag.firstChild) {
    parentTag.removeChild(parentTag.firstChild);
  }
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
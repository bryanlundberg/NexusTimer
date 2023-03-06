import { toggleActiveProfileTab } from "../toggle/toggle-profile-tabs.js";
import {
  deleteChilds,
  convertMStoDHMS,
  convertMsToTime,
  findUserId,
} from "../utils/functions.js";
import { getUserById, getUserCubeStatistics } from "../api/fetch-get.js";

let user;
let stats;

export const profilePage = async () => {
  try {
    toggleActiveProfileTab();
    const categoryFilter = document.querySelector("#category-filter");
    const cubeFilter = document.querySelector("#cube-filter");
    if (categoryFilter && cubeFilter) {
      const userId = findUserId();
      user = await getUserById(userId);
      generateInitialFilters();
      await updateStatistics();
      categoryFilter.addEventListener("change", executeChangeCategory);
      cubeFilter.addEventListener("change", async () => {
        await executeChangeCube();
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const executeChangeCategory = () => {
  toggleCategoryFilter();
  updateStatistics();
};

const executeChangeCube = async () => {
  try {
    toggleCubeFilter();
    await updateStatistics();
  } catch (error) {
    console.log(error);
  }
};

const toggleCubeFilter = () => {};

const updateStatistics = async () => {
  try {
    const categoryFilter = document.querySelector("#category-filter");
    const cubeFilter = document.querySelector("#cube-filter");
    const userId = findUserId();
    console.log(categoryFilter.value, cubeFilter.value, userId);
    stats = await getUserCubeStatistics(
      userId,
      categoryFilter.value,
      cubeFilter.value
    );
    console.log(stats);
    const cPb = document.querySelector("#best-time-category");
    const cMean = document.querySelector("#mean-category");
    const cAo5 = document.querySelector("#best-ao5-category");
    const cAo12 = document.querySelector("#best-ao12-category");
    const cAo50 = document.querySelector("#best-ao50-category");
    const cAo100 = document.querySelector("#best-ao100-category");
    const cAo1000 = document.querySelector("#best-ao1000-category");
    const cCount = document.querySelector("#count-category");
    const cCubingTime = document.querySelector("#solving-time-category");
    const uPb = document.querySelector("#best-time-cube");
    const uMean = document.querySelector("#mean-cube");
    const uAo5 = document.querySelector("#best-ao5-cube");
    const uAo12 = document.querySelector("#best-ao12-cube");
    const uAo50 = document.querySelector("#best-ao50-cube");
    const uAo100 = document.querySelector("#best-ao100-cube");
    const uAo1000 = document.querySelector("#best-ao1000-cube");
    const uCount = document.querySelector("#count-cube");
    const uCubingTime = document.querySelector("#solving-time-cube");
    cPb.textContent = convertMsToTime(stats.cPb);
    cMean.textContent = convertMsToTime(stats.cMean);
    cAo5.textContent = convertMsToTime(stats.cAo5);
    cAo12.textContent = convertMsToTime(stats.cAo12);
    cAo50.textContent = convertMsToTime(stats.cAo50);
    cAo100.textContent = convertMsToTime(stats.cAo100);
    cAo1000.textContent = convertMsToTime(stats.cAo1000);
    cCount.textContent = stats.cCount;
    cCubingTime.textContent = convertMStoDHMS(stats.cCubingTime);
    uPb.textContent = convertMsToTime(stats.uPb);
    uMean.textContent = convertMsToTime(stats.uMean);
    uAo5.textContent = convertMsToTime(stats.uAo5);
    uAo12.textContent = convertMsToTime(stats.uAo12);
    uAo50.textContent = convertMsToTime(stats.uAo50);
    uAo100.textContent = convertMsToTime(stats.uAo100);
    uAo1000.textContent = convertMsToTime(stats.uAo1000);
    uCount.textContent = stats.uCount;
    uCubingTime.textContent = convertMStoDHMS(stats.uCubingTime);
  } catch (error) {
    console.log(error);
  }
};

const toggleCategoryFilter = () => {
  const categoryList = document.querySelector("#category-filter");
  const cubeList = document.querySelector("#cube-filter");
  const selectedCategory = document.querySelector("#category-filter").value;
  deleteChilds("cube-filter");
  user.cubes.forEach((element) => {
    if (element.category == selectedCategory) {
      const cubeOption = document.createElement("option");
      cubeOption.value = element._id;
      cubeOption.textContent = element.name + " | " + element.category;
      cubeList.appendChild(cubeOption);
    }
  });
};

const generateInitialFilters = () => {
  const categoryList = document.querySelector("#category-filter");
  const cubeList = document.querySelector("#cube-filter");
  deleteChilds("category-filter");
  deleteChilds("cube-filter");
  user.categories.forEach((element) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = element;
    categoryOption.textContent = element;
    categoryList.appendChild(categoryOption);
  });
  const selectedCategory = document.querySelector("#category-filter").value;
  user.cubes.forEach((element) => {
    if (element.category == selectedCategory) {
      const cubeOption = document.createElement("option");
      cubeOption.value = element._id;
      cubeOption.textContent = element.name + " | " + element.category;
      cubeList.appendChild(cubeOption);
    }
  });
};

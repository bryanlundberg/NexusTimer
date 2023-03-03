import { updateStatisticsProfileChart, categoryFilterGen, cubeFilterGen , generateCategoryList } from "../toggle/profile-filter.js";
import { toggleActiveNavBar } from "../toggle/toggle.js";

export const profilePage = () => {
  toggleActiveNavBar();
  const categoryFilter = document.querySelector("#category-filter");
  const cubeFilter = document.querySelector("#cube-filter");
  if (categoryFilter || cubeFilter) {
    cubeFilter.setAttribute("disabled", true);
    generateCategoryList();
    updateStatisticsProfileChart();
    categoryFilter.addEventListener("change", categoryFilterGen);
    cubeFilter.addEventListener("change", cubeFilterGen);
  }
};

import { domain } from "../utils/constants.js";

export const getUserById = async (userId) => {
  try {
    const userData = await fetch(`${domain}/api/${userId}`);
    const data = await userData.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserCategoryStatistics = async (userId, category) => {
  try {
    const result = await fetch(`${domain}/api/${category}/${userId}`);
    if (!result.ok) {
      throw new Error("Something wrong happen getting the data.");
    }
    return result.json();
  } catch (err) {
    console.error(error);
  }
};

export const getUserCubeStatistics = async (userId, category, cubeId) => {
  try {
    const result = await fetch(`${domain}/api/${category}/${cubeId}/${userId}`);
    if (!result.ok) {
      throw new Error("Something wrong happen getting the data.");
    }
    return result.json();
  } catch (error) {
    console.log(error);
  }
};

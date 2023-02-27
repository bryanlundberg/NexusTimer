const apiUrl = "http://localhost:3000/api";
let data;

export async function loadTimerFilterOptions() {
	try {
	  const userId = document.querySelector(`input[name="id"]`).value;
	  console.log(userId)
	  const result = await fetch(`${apiUrl}/${userId}`);
	  if (!result.ok) {
	    throw new Error("Ha ocurrido un error al obtener los datos.");
	  }
	  data = await result.json();
	  console.log(data);
	} catch (error) {
	  console.log(error);
	}
}

export async function toggleTimerCategory() {
  try {
    const cube = document.querySelector("#cube");
    const category = document.querySelector("#category");

    if (category.value.toLowerCase() === "open this select menu") {
      clearFilterCube();
      //set default overall
      const defaultOverall = document.createElement("option");
      defaultOverall.textContent = "open this select menu";
      cube.appendChild(defaultOverall);
    }

    if (category.value.toLowerCase() !== "open this select menu") {
      clearFilterCube();
      generateCubesOptions();
    }
  } catch (error) {
    console.log(error);
  }
}

export async function toggleTimerCube() {
	try {
		
	} catch (error) {
		console.log(error)
	}
}

async function generateCubesOptions() {
  try {
    const category = document.querySelector("#category");
    const cube = document.querySelector("#cube");
    if (category.value.toLowerCase() === "open this select menu") return;
    const defaultOverall = document.createElement("option");
    defaultOverall.textContent = "Open this select menu";
    cube.appendChild(defaultOverall);

    data.cubes.forEach((element) => {
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
    const category = document.querySelector("#category");
    if (!category) {
      throw new Error("Fallo encontrnado category filter");
    }
	
    const defaultOverall = document.createElement("option");
    defaultOverall.textContent = "Open this select menu";
    cube.appendChild(defaultOverall);
	
    data.categories.forEach((element) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = element;
      optionElement.value = element;
      category.appendChild(optionElement);
    });
  } catch (error) {
    console.log(error);
  }
}

function clearFilterCategory() {
  const category = document.querySelector("#category");
  while (category.firstChild) {
    category.removeChild(category.firstChild);
  }
}

function clearFilterCube() {
  const cube = document.querySelector("#cube");
  while (cube.firstChild) {
    cube.removeChild(cube.firstChild);
  }
}
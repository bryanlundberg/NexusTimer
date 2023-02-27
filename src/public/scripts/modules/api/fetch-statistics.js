export async function generateStatistics() {

  try {
	const category = document.querySelector("#category").value
    const userId = document.querySelector(`input[name="id"]`).value;
	const result = await fetch(`http://localhost:3000/api/${category}/${userId}`)
	if (!result.ok) {throw new Error("Ha ocurrido un error al obtener los datos.");}
	return result.json();
 
  } catch (err) {
	  console.error(error);
  }

}

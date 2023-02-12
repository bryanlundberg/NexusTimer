const url = window.location.href;
const urlParts = url.split('/');
const userId = urlParts[urlParts.length - 1];
const apiUrl = "http://localhost:3000/api/"

export async function fetchOverallProfileStats() {
  try {
	  const result = await fetch(`${apiUrl}overall/${userId}`)
	  if (!result.ok) {throw new Error("Ha ocurrido un error al obtener los datos.");}
	  return await result.json();
    } catch (err) {
	  console.log(error);
  }

}

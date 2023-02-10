

export async function fetchSolves() {
  try {
	  
	  const url = window.location.href;
const urlParts = url.split('/');
const userId = urlParts[urlParts.length - 1];
const apiUrl = "http://localhost:3000/api/"
	  console.log(`${apiUrl}${userId}aa`)
	  const result = await fetch(`${apiUrl}${userId}`)
	  if (!result.ok) {throw new Error("Ha ocurrido un error al obtener los datos.");}
	  console.log(result)
	  return await result.json();
    } catch (err) {
	  console.log(error);
  }
}

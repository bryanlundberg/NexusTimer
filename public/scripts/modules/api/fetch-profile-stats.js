const url = window.location.href;
const urlParts = url.split('/');
const userId = urlParts[urlParts.length - 1];
const apiUrl = "http://localhost:3000/api"

export async function fetchProfileStats(category,cube) {
  try {
	  const result = await fetch(`${apiUrl}/stats/${category}/${cube}/${userId}`)//stats/category/cube/id
	  if (!result.ok) {throw new Error("Ha ocurrido un error al obtener los datos.");}
	  return await result.json();
    } catch (err) {
	  console.log(error);
  }

}
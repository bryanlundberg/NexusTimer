import { fetchSolves } from "../api/fetch-profile-stats.js";

export async function fillGraphs() {
	const a = await fetchSolves();
	console.log(a)

}
import { generateStatistics } from "../api/fetch-statistics.js";

export async function updateStatistics() {
	try {
		const obj = await generateStatistics();
		console.log(obj)
		const counter = document.querySelector("#count");
		const pb = document.querySelector("#pb");
		const avg5 = document.querySelector("#avg5");
		const avg12 = document.querySelector("#avg12");
		const avg50 = document.querySelector("#avg50");
/* 		const avg100 = document.querySelector("#avg100"); */
		const avg = document.querySelector("#avg");
		const desviation = document.querySelector("#desviation");
		
		pb.textContent = `${obj.pb}`
		avg5.textContent = `${obj.avg5}`
		avg12.textContent = `${obj.avg12}`
		avg50.textContent = `${obj.avg50}`
/* 		avg100.textContent = `${obj.avg100}` */
		counter.textContent = `${obj.counter}`
		desviation.textContent = `${obj.desviation}`
		avg.textContent = `${obj.avg}`
	
	} catch (err) {
		console.log(err)
	}

}
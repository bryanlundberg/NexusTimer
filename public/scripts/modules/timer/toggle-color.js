export function setActiveColor() {
	document.querySelector("#timer").classList.remove("text-danger");
	document.querySelector("#timer").classList.add("text-success");
}

export function setPendingColor() {
	document.querySelector("#timer").classList.remove("text-success");
	document.querySelector("#timer").classList.add("text-danger");
}

export function setResetColor() {
  document.querySelector("#timer").classList.remove("text-success");
  document.querySelector("#timer").classList.remove("text-danger");
}
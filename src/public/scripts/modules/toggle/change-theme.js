export function changeTheme() {
	const checkbox = document.querySelector("#theme");
	const html = document.querySelector("html")
  if (checkbox.checked) {
    html.setAttribute("data-bs-theme","dark")
  } else {
    html.setAttribute("data-bs-theme","light")
  }
}
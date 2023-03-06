export function changeTheme() {
	const checkboxTheme = document.querySelector("#theme");
	const label = document.querySelector(`label[for="theme"]`);
	const html = document.querySelector("html")
  if (checkboxTheme.checked) {
    html.setAttribute("data-bs-theme","dark")
		label.textContent = "Dark mode"
  } else {
    html.setAttribute("data-bs-theme","light")
		label.textContent = "Light mode"
  }
}
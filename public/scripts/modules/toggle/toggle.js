export function toggleActiveNavBar() {
  const navigation = document.querySelectorAll(
    "#profile-nav .nav-item a.nav-link"
  );
  const current = window.location.pathname;
  const currentUrl = window.location.href;

  for (let i = 0; i < navigation.length; i++) {
    let navLink = navigation[i].getAttribute("href");
    if (current === navLink) {
      navigation[i].classList.add("active");
    } else {
      navigation[i].classList.remove("active");
    }
  }
}

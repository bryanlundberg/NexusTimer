export function toggleActiveProfileTab() {
  const navigation = document.querySelectorAll(
    "#profile-nav .nav-item a.nav-link"
  );
  const current = window.location.pathname;
  const currentUrl = window.location.href;
  console.log("Current path:", current);
  console.log("Current URL:", currentUrl);

  if (navigation.length === 0) {
    console.warn("No navigation links found");
    return;
  }

  for (let i = 0; i < navigation.length; i++) {
    let navLink = navigation[i].getAttribute("href");
    if (!navLink) {
      console.warn("Navigation link has no href attribute:", navigation[i]);
      continue;
    }
    if (current === navLink) {
      navigation[i].classList.add("active");
    } else {
      navigation[i].classList.remove("active");
    }
  }
}
export default function loadCubes() {
  const cubesDB = window.localStorage.getItem("cubes");
  if (!cubesDB) {
    window.localStorage.setItem("cubes", "[]");
    return [];
  }

  if (cubesDB) {
    const parseCubes = JSON.parse(cubesDB);
    return parseCubes;
  }
}

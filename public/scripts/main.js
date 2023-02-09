//falta añadir metas semanales en el perfil tambien si se me olvida deje un buen dashboard de eejmplo en los pin de chrome
import { setNewScramble } from "./modules/scramble/scramble-generator.js";
import { handleDownKeys, handleUpKeys } from "./modules/timer/handle-keys.js";

document.querySelector("#category").addEventListener("input", setNewScramble);
document.addEventListener("keydown", handleDownKeys);
document.addEventListener("keyup", handleUpKeys);

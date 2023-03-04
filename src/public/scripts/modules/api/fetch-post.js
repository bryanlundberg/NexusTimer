import { URL } from "../utils/constants.js";

export const submitNewSolve = async (solveTime, startDate) => {

  const scramble = document.querySelector(`#scramble`).textContent;
  const cube = document.querySelector(`select[name="cube"]`).value;
  const idUser = document.querySelector(`input[name="id"]`).value;
  const csrf = document.querySelector(`input[name="_csrf"]`).value;

  await fetch(`${URL}/api/submit/solve`, {
    method: "POST",
    body: JSON.stringify({
			startDate: startDate,
      solveTime: solveTime,
      scramble: scramble,
      cubeName: cube,
      id: idUser,
      _csrf: csrf,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}
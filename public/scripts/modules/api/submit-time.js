export async function submitTime(solveTime) {
  const url = "http://localhost:3000";
  const scramble = document.querySelector(`#scramble`).textContent;
  const cube = document.querySelector(`select[name="cube"]`).value;
  const idUser = document.querySelector(`input[name="id"]`).value;
  const csrf = document.querySelector(`input[name="_csrf"]`).value;

  await fetch(`${url}/api/submit/solve`, {
    method: "POST",
    body: JSON.stringify({
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

import { fetchProfileStats } from "../api/fetch-profile-stats.js";

export async function fillGraphs() {
	try {
		const solveCounter = document.querySelector("#solveCounter")
		const solvingTime = document.querySelector("#solvingTime")
		const userStat = await fetchProfileStats();
		solveCounter.textContent = userStat.totalSolves;
		solvingTime.textContent = convertMStoDHMS(userStat.solvingTime);
		draw();
		draw2();
		draw3()
		
	} catch (err) {
		console.log(err)
	}
}

function draw3() {
var ctx = document.getElementById('myChart3').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
            label: '# de resoluciones de cubo de Rubik',
            data: [12, 19, 3, 5, 2, 3, 20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1,
            fill: 'start'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

document.getElementById('time-filter').addEventListener('change', function() {
  var selectedFilter = this.value;
  var labels, data;

  switch (selectedFilter) {
    case 'day':
      labels = ['1', '2', '3', '4', '5', '6', '7'];
      data = [12, 19, 3, 5, 2, 3, 20];
      break;
    case 'week':
      labels = ['Semana 1', 'Semana 2', 'Semana 3'];
      data = [50, 35, 20];
      break;
    case 'month':
      labels = ['Enero', 'Febrero', 'Marzo'];
      data = [150, 100, 60];
      break;
  }

  myChart.data.labels = labels;
  myChart.data.datasets[0].data = data;
  myChart.update();
});
}

function draw() {
	const ctx = document.querySelector('#myChart').getContext('2d');
	const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['2x2', '3x3', '3x3 OH', '4X4', '5X5', 'Megaminx'],
        datasets: [{
            label: '# solves',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
		options: {
		  scales: {
		  }
		}
});
}

function draw2() {
	      var ctx = document.getElementById('myChart2').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['Cubo 1', 'Cubo 2', 'Cubo 3', 'Cubo 4', 'Cubo 5'],
          datasets: [{
            label: '# de veces utilizado',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
		options: {
		  scales: {
		  }
		}
      });
}



function convertMStoDHMS(ms) {
  let time = {};
  time.days = Math.floor(ms / (1000 * 60 * 60 * 24));
  time.hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  time.minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  time.seconds = Math.floor((ms % (1000 * 60)) / 1000);

  let result = '';
  if (time.days > 0) {
    result += time.days + (time.days === 1 ? ' day ' : ' days ');
  }
  if (time.hours > 0) {
    result += time.hours + (time.hours === 1 ? ' hour ' : ' hours ');
  }
  if (time.minutes > 0) {
    result += time.minutes + (time.minutes === 1 ? ' minute ' : ' minutes ');
  }
  if (time.seconds > 0) {
    result += time.seconds + (time.seconds === 1 ? ' second ' : ' seconds ');
  }
  return result.trim();
}
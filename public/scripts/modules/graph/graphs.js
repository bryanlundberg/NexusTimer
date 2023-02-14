import { fetchProfileStats } from "../api/fetch-profile-stats.js";
import { convertMStoDHMS } from "../utils/time-converter.js";
export async function fillGraphs() {
	try {
		const category = document.querySelector("#category-filter").value
		const cube = document.querySelector("#cube-filter").value
		
		const userStat = await fetchProfileStats(category,cube);
		
		console.log(userStat)
		
		const solvingTime = document.querySelector("#solving-time").textContent = convertMStoDHMS(userStat.solvingTime)
		const pb = document.querySelector("#best-time").textContent = userStat.pb
		const avg = document.querySelector("#mean").textContent = userStat.avg
		const result5 = document.querySelector("#best-ao5").textContent = userStat.result5
		const result12 = document.querySelector("#best-ao12").textContent = userStat.result12
		const result50 = document.querySelector("#best-ao50").textContent = userStat.result50
		const result100 = document.querySelector("#best-ao100").textContent = userStat.result100
		const result1000 = document.querySelector("#best-ao1000").textContent = userStat.result1000
		const desviation = document.querySelector("#desviation").textContent = userStat.desviation
		const solvesCount = document.querySelector("#count").textContent = userStat.solvesCount
		

		
	} catch (err) {
		console.log(err)
	}
}


export function changeCurrentCharts() {
	
	
}

function drawMainGraph(labels, ) {
const ctx = document.querySelector('#grapthMain').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Sunday', 'Monday', "Tuesday", 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
            label: '# Solves',
            data: [3244, 4376,5442,4345,7876,1645,8436],
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
  const selectedFilter = this.value;
  let labels, data;

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
	  const ctx = document.getElementById('myChart2').getContext('2d');
      const myChart = new Chart(ctx, {
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
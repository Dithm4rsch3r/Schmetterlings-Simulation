// Data for the Barchart
let data;

// Create a bar chart using Chart.js
let ctx;
let barChart;
createmybarchart();
dummyHabitat();

function dummyHabitat () {
  const habitatMatrix = document.getElementById("habitatMatrix");
  habitatMatrix.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const row = habitatMatrix.insertRow(i);
    for (let j = 0; j < 10; j++) {
      const cell = row.insertCell(j);
      cell.innerHTML = `<div class="cell-content">
                             <img src="images/Dirt_plant.png" alt="Plant" class="plant-img">
                              </div>`;
    }
  }
}

function visualizeHabitat() {
  const habitatMatrix = document.getElementById("habitatMatrix");
  habitatMatrix.innerHTML = "";

  for (let i = 0; i < simulation.habitat.habitat.length; i++) {
    const row = habitatMatrix.insertRow(i);
    for (let j = 0; j < simulation.habitat.habitat[i].length; j++) {
      const cell = row.insertCell(j);
      const plant = simulation.habitat.habitat[i][j];
      if (plant) {
        if (plant.alive) {
          cell.innerHTML = `<div class="cell-content">
                              <img src="images/Dirt_plant.png" alt="Plant" class="plant-img">
                              </div>`;

          if (plant.butterflies > 0) {
            cell.querySelector(
              ".cell-content"
            ).innerHTML += `<sub class="emoji">🦋 ${plant.butterflies}</sub>`;
          }
          if (plant.caterpillar > 0) {
            cell.querySelector(
              ".cell-content"
            ).innerHTML += `<sub class="emoji">🐛 ${plant.caterpillar}</sub>`;
          }
          if (plant.eggs > 0) {
            cell.querySelector(
              ".cell-content"
            ).innerHTML += `<sub class="emoji">🥚 ${plant.eggs}</sub>`;
          }
        } else {
          cell.innerHTML = `<div class="cell-content">
                              <img src="images/Dirt_deadplant.png" alt="Plant" class="plant-img">
                              <sub class="skullemoji">💀</sub>
                              </div>`;
        }
      } else {
        cell.innerHTML = `<div class="cell-content">
                              <img src="images/Dirt.png" alt="Plant" class="plant-img">
                              </div>`;
      }
    }
  }
}

function createmybarchart() {
  data = {
    labels: [],
    datasets: [
      {
        label: "Schmetterlinge",
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  ctx = document.getElementById("bar-chart").getContext("2d");
  barChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

//Add new data to the chart
function addData(chart, label, newData) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(newData);
  });
}

//Remove the oldest data from the chart
function removeData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
}

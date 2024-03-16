const BUTTONRAIN = document.getElementById("toggle1");
const BUTTONSPRAYED = document.getElementById("toggle2");
const BUTTONPLOUGHED = document.getElementById("toggle3");
const BUTTONDROUGHT = document.getElementById("toggle4");
let rain = false;
let sprayed = false;
let ploughed = false;
let drought = false;
let year;

BUTTONRAIN.addEventListener("change", function () {
    rain = this.checked;
});

BUTTONSPRAYED.addEventListener("change", function () {
    sprayed = this.checked;
});

BUTTONPLOUGHED.addEventListener("change", function () {
    ploughed = this.checked;
});

BUTTONDROUGHT.addEventListener("change", function () {
    drought = this.checked;
});

function updateSliderValue(type, value) {
    document.getElementById(`${type}Value`).innerText = value;
  }

function startSimulation() {
    year = 0;
    if(barChart !== undefined){
      barChart.destroy()
      createmybarchart()
    }
      
    const butterflies = parseInt(
      document.getElementById("butterfliesSlider").value
    );
    const plants = parseInt(document.getElementById("plantsSlider").value);

    start_simulation(butterflies, plants, false, false, false, false);
    visualizeHabitat();

    barChart.data.labels = [];
    barChart.data.datasets.data = [];

    addData(barChart, "Jahr 0", simulation.habitat.butterfliestotal);
    barChart.update();
  }

function nextCycle() {
    next(rain, sprayed, ploughed, drought);
    visualizeHabitat();
    if (state == "butterfly") {
      year++;
      addData(
        barChart,
        "Jahr " + String(year),
        simulation.habitat.butterfliestotal
      );
      if (year >= 10) {
        removeData(barChart);
      }
      barChart.update();
    }
  }

function download() {
    var image = document.createElement("a");
    image.href = barChart.toBase64Image();
    image.download = "Diagramm_Schmetterlingssimulation.png";
    // Trigger the download
    image.click();
  }
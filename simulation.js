class Plant {
  /* 
  Plant class simulates the state of a plant with the amount of eggs, caterpillar and butterflies
  living on it.
  */

  /* 
  Defining static constants for the Plant Class.
  */
  static REGENERATION_TIME = 1;
  static CATERPILLAR_LIMIT = 30;

  constructor() {
    /* 
    Plant Class constructor with the amount of eggs, caterpillar and butterflies, the current state of
    the plant and the amount of time since the plant died if so.
    */
    this.alive = true;
    this.sincedeath = NaN;
    this.eggs = 0;
    this.caterpillar = 0;
    this.butterflies = 0;
  }

  seteggs(value) {
    /* 
    Set the amount of eggs
    */
    this.eggs = value;
  }

  setcaterpillar(value) {
    /*
    Set the amount of caterpillar living on the plant. Caterpillar can only survive on alive plants.
    */
    if (this.alive) {
      if (value > Plant.CATERPILLAR_LIMIT) {
        let oldeggs = this.killplant();
        return [null, oldeggs];
      } else {
        this.caterpillar = value;
        return [true];
      }
    }
    return false;
  }

  setbutterflies(value) {
    /*
    Set the amount of butterflies.
    */
    this.butterflies = value;
  }

  killplant() {
    /* 
    Simulate the death of the plant
    */
    let oldeggs = this.eggs;
    this.alive = false;
    this.sincedeath = 0;
    this.eggs = 0;
    this.caterpillar = 0;
    this.butterflies = 0;
    console.log("One plant died")
    return oldeggs;
  }

  regenerateplant() {
    /* 
    Regenerate the plant (sincedeath + 1 if under Regeneration Time and this.alive = true if equal
    to Regeneration Time).
    */
    if (!this.alive) {
      if (this.sincedeath === Plant.REGENERATION_TIME) {
        this.alive = true;
        this.sincedeath = NaN;
        console.log("regenerated one plant");
        return true;
      } else {
        this.sincedeath += 1;
        return false;
      }
    }
  }
}

// ----------------------------------------------------------------------------------------------

class Habitat {
  /*
  Class Habitat simulates the surrounding conditioncies for the evolution of the butterflies.
  */
  constructor(plants, butterflies) {
    /*
    Define the amount of total eggs/caterpillar/butterflies living in the entire habitat
    */
    this.eggstotal = 0;
    this.caterpillartotal = 0;
    this.butterfliestotal = butterflies;
    this.plants = plants;
    this.deadplants = 0;

    /* 
    Initiate a matrix of the size 10x10 to simulate every spatial unit in the habitat
    */
    this.habitat = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.habitat[i] = new Array(10).fill(null);
    }

    /* 
    Define an array with all coordinates of the given matrix
    */
    let emptyfields = new Array();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        emptyfields.push([i, j]);
      }
    }

    /* 
    Initiate an array to save all used coordinates of the given matrix
    */
    this.plantedfields = new Array();

    /* 
    Save the matrix with the given amount of plants on random spacial units
    */
    let index;
    let matrixindex;
    for (let i = 0; i < plants; i++) {
      index = Math.floor(Math.random() * emptyfields.length);
      matrixindex = emptyfields[index];
      this.habitat[matrixindex[0]][matrixindex[1]] = new Plant();
      this.plantedfields.push(emptyfields[index]);
      emptyfields.splice(index, 1);
    }

    /*
    Assign every butterfly of the given amount to a random plant
    */
    let coordinates;
    for (let i = 0; i < butterflies; i++) {
      coordinates = this.getrandomplant();
      this.habitat[coordinates[0]][coordinates[1]].setbutterflies(
        this.habitat[coordinates[0]][coordinates[1]].butterflies + 1
      );
    }
  }

  killeggs() {
    /* 
    Set the amount of eggs on every plant to 0
    */
    let coordinates;
    for (let i = 0; i < this.plantedfields.length; i++) {
      coordinates = this.plantedfields[i];
      this.habitat[coordinates[0]][coordinates[1]].seteggs(0);
    }
    this.eggstotal = 0;
  }

  killcaterpillar() {
    /* 
    Set the amount of caterpillar on every plant to 0
    */
    let coordinates;
    for (let i = 0; i < this.plantedfields.length; i++) {
      coordinates = this.plantedfields[i];
      this.habitat[coordinates[0]][coordinates[1]].setcaterpillar(0);
    }
    this.caterpillartotal = 0;
  }

  killbutterflies() {
    /* 
    Set the amount of butterflies on every plant to 0
    */
    let coordinates;
    for (let i = 0; i < this.plantedfields.length; i++) {
      coordinates = this.plantedfields[i];
      this.habitat[coordinates[0]][coordinates[1]].setbutterflies(0);
    }
    this.butterfliestotal = 0;
  }

  getrandomplant() {
    /* 
    Return the coordinates of a random plant
    */
    let coordinates =
      this.plantedfields[Math.floor(Math.random() * this.plantedfields.length)];
    return coordinates;
  }

  nextcycle() {
    /* 
    Use the regenerateplant function on every plant in the habitat
    */
    for (let i = 0; i < this.plantedfields.length; i++) {
      let regenerated = this.habitat[this.plantedfields[i][0]][
        this.plantedfields[i][1]
      ].regenerateplant();
      if (regenerated) {
        this.deadplants -= 1;
      } 
    }
  }
}

// ----------------------------------------------------------------------------------------------

class Simulation {
  /*
  Simulation class contains all attributes and methods for the simulation of the evolution of
  butterflies
  */

  /*
  Defining class specific constants
  */
  static EGGS_PLOUGHED_FACTOR = 0.1;
  static EGGS_SPRAYED_FACTOR = 0.9;
  static CATERPILLAR_RAIN_FACTOR = 0.7;
  static CATERPILLAR_SPRAYED_FACTOR = 0.1;
  static CATERPILLAR_PLOUGHED_FACTOR = 0.1;
  static CATERPILLAR_DROUGHT_FACTOR = 0.3;
  static BUTTERFLY_RAIN_FACTOR = 0.5;
  static BUTTERFLY_SPRAYED_FACTOR = 0.4;
  static BUTTERFLY_PLOUGHED_FACTOR = 0.9;
  static BUTTERFLY_DROUGHT_FACTOR = 0.7;

  static FEMALE_BUTTERFLY_FACTOR = 0.5;
  static AMOUNT_OF_PACKS = 15;
  static EGGS_PER_PACK = 10;
  static EGGS_TO_CATERPILLAR_PERCENTAGE_MAX = 21;
  static EGGS_TO_CATERPILLAR_PERCENTAGE_MIN = 8;
  static CATERPILLAR_TO_BUTTERFLY_PERCENTAGE_MAX = 12.5;
  static CATERPILLAR_TO_BUTTERFLY_PERCENTAGE_MIN = 7.5;

  constructor(butterfly, plants, rain, sprayed, ploughed, drought) {
    /*
    Checks if all given values are of the right type and, if so, saves them in variables
    generates the habitat
    */
    if (
      typeof rain != "boolean" ||
      typeof ploughed != "boolean" ||
      typeof sprayed != "boolean" ||
      typeof drought != "boolean" ||
      typeof butterfly != "number" ||
      typeof plants != "number"
    ) {
      console.error(
        "rain, ploughed and sprayed must be boolean and butterfly and plants must be integer"
      );
      return;
    } else {
      this.habitat = new Habitat(plants, butterfly);
      this.rain = rain;
      this.sprayed = sprayed;
      this.ploughed = ploughed;
      this.drought = drought;
    }
  }

  randomfrombellcurve(min, max, skew) {
    /* 
    Return a random value between min and max based on a gaussian normal distribution
    */
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = this.randomfrombellcurve(min, max, skew);
    // resample between 0 and 1 if out of range
    else {
      num = Math.pow(num, skew); // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }
  /*    
  Source: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve   
  */

  cycle_eggs() {
    /* 
    Calculate the total amounts of eggs that the butterflies lay and assign them to random plants in
    packs of 10 eggs
    */
    let eggsperpack = Simulation.EGGS_PER_PACK;
    if (this.ploughed) {
      eggsperpack = Math.floor(
        Simulation.EGGS_PLOUGHED_FACTOR * eggsperpack
      );
    }
    if (this.sprayed) {
      eggsperpack = Math.floor(
        Simulation.EGGS_SPRAYED_FACTOR * eggsperpack
      );
    }
    let j = 0;
    for (let i = 0; i < Math.floor(this.habitat.butterfliestotal * Simulation.FEMALE_BUTTERFLY_FACTOR); i++) {
      j = 0;
      while (j <= Simulation.AMOUNT_OF_PACKS) {
        let coordinates = this.habitat.getrandomplant();
        if (this.habitat.habitat[coordinates[0]][coordinates[1]].alive === true) {
          this.habitat.habitat[coordinates[0]][coordinates[1]].seteggs(
          this.habitat.habitat[coordinates[0]][coordinates[1]].eggs + eggsperpack);
          j++;
        }
      }
    }
    this.habitat.killbutterflies();
    let coordinates;
    for (let i = 0; i < this.habitat.plantedfields.length; i++) {
      coordinates = this.habitat.plantedfields[i];
      this.habitat.eggstotal += this.habitat.habitat[coordinates[0]][coordinates[1]].eggs;
    }
  }

  cycle_caterpillar() {
    /* 
    Calculate the amount of caterpillar that hatches from the current amount of eggs based on the general survivablity
    and the events
    */
    let survivability =
      this.randomfrombellcurve(
        Simulation.EGGS_TO_CATERPILLAR_PERCENTAGE_MIN,
        Simulation.EGGS_TO_CATERPILLAR_PERCENTAGE_MAX,
        1
      ) / 100;
    let caterpillaramount = Math.floor(survivability * this.habitat.eggstotal);
    if (this.rain) {
      caterpillaramount = Math.floor(
        Simulation.CATERPILLAR_RAIN_FACTOR * caterpillaramount
      );
    }
    if (this.sprayed) {
      caterpillaramount = Math.floor(
        Simulation.CATERPILLAR_SPRAYED_FACTOR * caterpillaramount
      );
    }
    if (this.ploughed) {
      caterpillaramount = Math.floor(
        Simulation.CATERPILLAR_PLOUGHED_FACTOR * caterpillaramount
      );
    }
    if (this.drought) {
      caterpillaramount = Math.floor(
        Simulation.CATERPILLAR_DROUGHT_FACTOR * caterpillaramount
      );
    }
    let coordinates;
    let added;
    while (caterpillaramount > 0) {
      coordinates = this.habitat.getrandomplant();
      if (this.habitat.deadplants >= this.habitat.plants || this.habitat.eggstotal <= 0) {
        caterpillaramount = 0;
      }
      if (this.habitat.habitat[coordinates[0]][coordinates[1]].eggs > 0) {
        this.habitat.habitat[coordinates[0]][coordinates[1]].eggs -= 1;
        this.habitat.eggstotal -= 1;
        added = this.habitat.habitat[coordinates[0]][
          coordinates[1]
        ].setcaterpillar(
          this.habitat.habitat[coordinates[0]][coordinates[1]].caterpillar + 1
        );
        if (added[0] == null) {
          this.habitat.deadplants += 1;
          this.habitat.eggstotal = Math.max(0, this.habitat.eggstotal - added[1]);
        }
        caterpillaramount -= 1;
      }
    }
    for (let i = 0; i < this.habitat.plantedfields.length; i++) {
      coordinates = this.habitat.plantedfields[i];
      this.habitat.caterpillartotal += this.habitat.habitat[coordinates[0]][coordinates[1]].caterpillar;
    }
    this.habitat.killeggs();
  }

  cycle_butterfly() {
    /* 
    Calculate the amount of butterflies that evolve from the current amount of caterpillar based on the general 
    survivablity and the events
    */
    let survivability =
      this.randomfrombellcurve(
        Simulation.CATERPILLAR_TO_BUTTERFLY_PERCENTAGE_MIN,
        Simulation.CATERPILLAR_TO_BUTTERFLY_PERCENTAGE_MAX,
        1
      ) / 100;
    let butterflyamount = Math.floor(
      survivability * this.habitat.caterpillartotal
    );
    if (this.rain) {
      butterflyamount = Math.floor(
        Simulation.BUTTERFLY_RAIN_FACTOR * butterflyamount
      );
    }
    if (this.sprayed) {
      butterflyamount = Math.floor(
        Simulation.BUTTERFLY_SPRAYED_FACTOR * butterflyamount
      );
    }
    if (this.ploughed) {
      butterflyamount = Math.floor(
        Simulation.BUTTERFLY_PLOUGHED_FACTOR * butterflyamount
      );
    }
    if (this.drought) {
      butterflyamount = Math.floor(
        Simulation.BUTTERFLY_DROUGHT_FACTOR * butterflyamount
      );
    }
    let coordinates;
    while (butterflyamount > 0) {
      coordinates = this.habitat.getrandomplant();
      if (
        this.habitat.habitat[coordinates[0]][coordinates[1]].caterpillar > 0
      ) {
        this.habitat.habitat[coordinates[0]][coordinates[1]].caterpillar -= 1;
        this.habitat.habitat[coordinates[0]][coordinates[1]].setbutterflies(
          this.habitat.habitat[coordinates[0]][coordinates[1]].butterflies + 1
        );
        butterflyamount -= 1;
      }
    }
    this.habitat.killcaterpillar();
    for (let i = 0; i < this.habitat.plantedfields.length; i++) {
      coordinates = this.habitat.plantedfields[i];
      this.habitat.butterfliestotal += this.habitat.habitat[coordinates[0]][coordinates[1]].butterflies;
    }
  }

  next_cycle(rain, sprayed, ploughed, drought, state) {
    /* 
    Start the next cycle based on the current state in the following 
    order (eggs -> caterpillar -> butterflies -> ...)
    */
    this.rain = rain;
    this.sprayed = sprayed;
    this.ploughed = ploughed;
    this.drought = drought;
    this.habitat.nextcycle();
    if (state === "butterfly") {
      this.cycle_eggs();
    } else if (state === "egg") {
      this.cycle_caterpillar();
    } else if (state === "caterpillar") {
      this.cycle_butterfly();
    }
  }
}

// ----------------------------------------------------------------------------------------------

/*
Define global variable to save the current simulation
*/
let simulation;
let state;

function start_simulation(butterfly, plants, rain, sprayed, ploughed, drought) {
  /*
  Start a new simulation and save it in the global variable simulation
  */
  state = "butterfly";
  simulation = new Simulation(
    butterfly,
    plants,
    rain,
    sprayed,
    ploughed,
    drought
  );
  console.log(
    "Starting simulation with " +
      butterfly +
      " butterflies and " +
      plants +
      " plants"
  );
}

function next(rain, sprayed, ploughed, drought) {
  /*
  Check if there is a simulation, if so, start the next cycle of the simulation based on the 
  current state. If not, throw an error.
  */
  if (typeof simulation == "undefined") {
    console.error("Must start a new simulation first");
    alert("Bitte starte zunächst eine neue Simulation");
    return;
  }
  simulation.next_cycle(rain, sprayed, ploughed, drought, state);
  if (state === "butterfly") {
    state = "egg";
    console.log(simulation.habitat.eggstotal, "eggs");
  } else if (state === "egg") {
    state = "caterpillar";
    console.log(simulation.habitat.caterpillartotal, "caterpillar");
  } else if (state === "caterpillar") {
    state = "butterfly";
    console.log(simulation.habitat.butterfliestotal, "butterflies");
  }
}
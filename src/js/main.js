let maxFloorCount;
let maxElevatorCount;
let inputForm = document.querySelector("form");
inputForm.addEventListener("submit", createInterface);

let elevators = [];

const elevatorHeight = 90.8;
let queuedRequests = [];
let activeRequests = [];

setInterval(elevatorManager, 50);

function checkInputValidity(floorCount, elevatorCount) {
  if (isNaN(elevatorCount) || isNaN(floorCount)) {
    alert(`Input fields cannot be empty`);
    return false;
  } else if (floorCount <= 0 || elevatorCount <= 0) {
    alert("Floor count and elevator count must be positive integers.");
    return false;
  } else if (elevatorCount > floorCount) {
    alert(
      `Please enter an elevator count less than or equal to the floor count.`
    );
    return false;
  }
  return true;
}

function createStructure(floorCount, elevatorCount) {
  let structure = document.querySelector("#structure");
  structure.innerHTML = "";
  for (let i = floorCount; i >= 1; i--) {
    let floor = document.createElement("div");
    floor.classList.add("floor");
    let elevatorLabels = document.createElement("div");
    elevatorLabels.classList.add("elevator-labels");
    let floorLabel = document.createElement("span");
    floorLabel.textContent = "Floor " + i;
    elevatorLabels.appendChild(floorLabel);
    let controlsContainer = document.createElement("div");
    controlsContainer.classList.add("controls-container");
    if (i !== floorCount) {
      let upBtn = document.createElement("button");
      upBtn.id = "upBtn" + i;
      upBtn.classList.add("upBtn");
      upBtn.onclick = () => handleFloorRequest(upBtn); // Todo - handleFloorRequest
      upBtn.innerHTML = "↑";
      controlsContainer.appendChild(upBtn);
    }
    if (i !== 1) {
      let downBtn = document.createElement("button");
      downBtn.id = "downBtn" + i;
      downBtn.classList.add("downBtn");
      downBtn.onclick = () => handleFloorRequest(downBtn); // Todo - handleFloorRequest
      downBtn.innerHTML = "↓";
      controlsContainer.appendChild(downBtn);
    }
    elevatorLabels.appendChild(controlsContainer);
    floor.appendChild(elevatorLabels);
    if (i === 1) {
      for (let j = 1; j <= elevatorCount; j++) {
        let elevator = document.createElement("div");
        elevator.id = "elevator" + j;
        elevator.classList.add("elevator");
        let leftDoor = document.createElement("div");
        leftDoor.id = "left-door" + j;
        leftDoor.classList.add("left-door");
        let rightDoor = document.createElement("div");
        rightDoor.id = "right-door" + j;
        rightDoor.classList.add("right-door");
        elevator.appendChild(leftDoor);
        elevator.appendChild(rightDoor);
        floor.appendChild(elevator);
      }
    }
    structure.appendChild(floor);
  }

  elevators = Array.from(document.querySelectorAll(".elevator"), (el) => ({
    element: el,
    inUse: false,
    currentFloor: 1,
  }));

  const elevatorHeight = 90.8; // units in px
  queuedRequests = [];
  activeRequests = Array(elevators.length).fill(null);
}

function createInterface(event) {
  event.preventDefault();
  let floorCountInput = document.querySelector("#floor_count");
  let elevatorCountInput = document.querySelector("#elevator_count");
  let floorCount = parseInt(floorCountInput.value);
  let elevatorCount = parseInt(elevatorCountInput.value);
  if (checkInputValidity(floorCount, elevatorCount)) {
    inputSection.style.display = "none";
    createStructure(floorCount, elevatorCount);
  }
}

function extractNumberFromId(string) {
  const regex = /\d+/;
  const match = regex.exec(string);
  return match ? parseInt(match[0], 10) : null;
}

function handleFloorRequest(event) {
  floorNum = extractNumberFromId(event.id);
  if (
    !queuedRequests.includes(floorNum) &&
    !activeRequests.includes(floorNum)
  ) {
    queuedRequests.push(floorNum);
  }
}

function elevatorManager() {
  if (queuedRequests.length > 0) {
    const closestElevator = findClosestIdleElevator(queuedRequests[0]);
    if (closestElevator) {
      elevatorId = extractNumberFromId(closestElevator.element.id);
      operateElevator(elevatorId, queuedRequests[0]);
    }
  }
}

function operateElevator(elevatorId, floorNum) {
  queuedRequests.shift();
  activeRequests[elevatorId - 1] = floorNum;
  const elevator = elevators[elevatorId - 1];
  elevators[elevatorId - 1].inUse = true;
  const verticalMove = (floorNum - 1) * elevatorHeight * -1;
  const travelTime = Math.abs(floorNum - elevator.currentFloor) * 2;
  elevator.element.style.transform = `translateY(${verticalMove}px)`;
  elevator.element.style.transition = `${travelTime}s linear`;
  toggleElevatorDoors(elevatorId, travelTime * 1000);
  setTimeout(() => {
    elevators[elevatorId - 1].currentFloor = floorNum;
    elevators[elevatorId - 1].inUse = false;
  }, travelTime * 1000 + 5000);
}

function findClosestIdleElevator(floorNum) {
  let shortestDistance = Infinity;
  let closestElevator = null;
  for (let i = 0; i < elevators.length; i++) {
    if (elevators[i].inUse) continue;
    const distance = Math.abs(floorNum - elevators[i].currentFloor);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestElevator = elevators[i];
    }
  }
  return closestElevator;
}

function toggleElevatorDoors(elevatorId, duration) {
  setTimeout(() => {
    openElevatorDoors(elevatorId);
  }, duration);
  setTimeout(() => {
    closeElevatorDoors(elevatorId);
  }, duration + 2500);
  setTimeout(() => {
    activeRequests[elevatorId - 1] = null;
  }, duration + 5000);
}

function openElevatorDoors(elevatorId) {
  elevators[elevatorId - 1].element
    .querySelector(`#left-door${elevatorId}`)
    .classList.remove(`left-door-close`);
  elevators[elevatorId - 1].element
    .querySelector(`#right-door${elevatorId}`)
    .classList.remove(`right-door-close`);
  elevators[elevatorId - 1].element
    .querySelector(`#left-door${elevatorId}`)
    .classList.add(`left-door-open`);
  elevators[elevatorId - 1].element
    .querySelector(`#right-door${elevatorId}`)
    .classList.add(`right-door-open`);
}

function closeElevatorDoors(elevatorId) {
  elevators[elevatorId - 1].element
    .querySelector(`#left-door${elevatorId}`)
    .classList.remove(`left-door-open`);
  elevators[elevatorId - 1].element
    .querySelector(`#right-door${elevatorId}`)
    .classList.remove(`right-door-open`);
  elevators[elevatorId - 1].element
    .querySelector(`#left-door${elevatorId}`)
    .classList.add(`left-door-close`);
  elevators[elevatorId - 1].element
    .querySelector(`#right-door${elevatorId}`)
    .classList.add(`right-door-close`);
}

// Todo - Responsive
// Check for device width and act accordingly - show some user feedback - alert

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

window.addEventListener("load", () => {
  if (viewportWidth < 220) {
    alert(
      "Viewport size is too small. Elevator simulation won't function on this device."
    );
  }
});

function determineMaxInputValues() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  maxElevatorCount = parseInt(viewportWidth / 100) - 3;
  if (viewportWidth < 500 && viewportWidth >= 300) {
    maxElevatorCount = 2;
  } else if (viewportWidth < 330) {
    maxElevatorCount = 1;
  }
}

window.addEventListener("resize", determineMaxInputValues);
window.addEventListener("load", determineMaxInputValues);

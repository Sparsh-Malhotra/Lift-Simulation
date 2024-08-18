let maxFloorCount;
let maxElevatorCount;
let inputForm = document.querySelector("form");
inputForm.addEventListener("submit", createInterface);

function checkInputValidity(floorCount, elevatorCount) {
  if (isNaN(elevatorCount) || isNaN(floorCount)) {
    alert(`Input fields cannot be empty`);
    return false;
  } else if (floorCount <= 0 || elevatorCount <= 0) {
    alert("Floor count and elevator count must be positive integers.");
    return false;
  } else if (elevatorCount > maxElevatorCount) {
    alert(
      `Please enter an elevator count less than or equal to ${maxElevatorCount}.`
    );
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
    returnBtnArea.style.display = "block";
    createStructure(floorCount, elevatorCount);
  }
}

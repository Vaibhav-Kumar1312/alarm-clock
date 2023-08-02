// Refernence of DOM elements
const displayClock = document.querySelector(".display-clock");
const hourInput = document.querySelector("#hourInput");
const minuteInput = document.querySelector("#minuteInput");
const btnSetAlarm = document.querySelector(".setAlarm");
const activeAlarms = document.querySelector(".activeAlarms");
let alarmSound = new Audio("./alarmSound.wav");
let alarmIndex = 0;
let alarmsArray = [];

/**
 * It takes single digit time and appends zero in front
 * @param {clock Time} value
 * @returns value with zero append in front
 */
function appendZero(value) {
  let newValue = String(value).padStart(2, "0");
  return newValue;
}

/**
 * Searches the desired alarm object
 * @param {custom attribute on which we are searching in array} id
 * @param {custom attribute value to be searched} dataID
 * @returns array of larm object properties
 */
function searchAlarmObject(id, dataID) {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((item, index) => {
    if (item[id] === dataID) {
      alarmObject = item;
      objIndex = index;
      exists = true;
      return;
    }
  });

  return [exists, alarmObject, objIndex];
}

/**
 * Displays the clock timer and check the alarm
 * time with current time
 */
function displayClockTimer() {
  let date = new Date();
  let hour = appendZero(date.getHours());
  let minute = appendZero(date.getMinutes());
  let second = appendZero(date.getSeconds());
  displayClock.innerHTML = `${hour}:${minute}:${second}`;

  alarmsArray.forEach((item, idx) => {
    if (
      item.isActive &&
      `${item.alarmHour}:${item.alarmMinute}` === `${hour}:${minute}`
    ) {
      alarmSound.play();
      alarmSound.loop = true;
    }
  });
}

/**
 * runs the displayClockTImer function on window
 * with set interval
 */
window.addEventListener("load", function () {
  setInterval(displayClockTimer);
});

/**
 * Validates the alarm input
 * @param {alarm input value} inputValue
 * @param {maxValue of input} maxValue
 * @returns
 */
function validateInput(inputValue, maxValue) {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
    return inputValue;
  }
  if (inputValue > maxValue) {
    alert("Enter valid Time");
    return (inputValue = "");
  }
  return inputValue;
}

/**
 * validate hour input
 */
hourInput.addEventListener("input", function () {
  hourInput.value = validateInput(hourInput.value, 23);
});

/**
 * validate minute Input
 */
minuteInput.addEventListener("input", function () {
  minuteInput.value = validateInput(minuteInput.value, 59);
});

/**
 * creates an alarm div
 * @param {alarm object} alarmObj
 */
function createAlarm(alarmObj) {
  const { id, alarmHour, alarmMinute } = alarmObj;
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;

  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.checked = true;
  checkBox.addEventListener("click", function (e) {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkBox);
  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `❌`;
  deleteBtn.classList.add("deleteButton");
  deleteBtn.addEventListener("click", function (e) {
    deleteAlarm(e);
  });

  alarmDiv.appendChild(deleteBtn);
  activeAlarms.appendChild(alarmDiv);
}

/**
 * EventListener on add alarm button to create and add alarm
 */
btnSetAlarm.addEventListener("click", function () {
  if (hourInput.value != "" && minuteInput.value != "") {
    alarmIndex += 1;
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.isActive = true;
    alarmsArray.push(alarmObj);
    // console.log(alarmObj, alarmsArray);
    createAlarm(alarmObj);
    hourInput.value = "";
    minuteInput.value = "";
  }
});

/**
 * To start alarm
 * @param {event object} e
 */
function startAlarm(e) {
  let searchID = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchAlarmObject("id", searchID);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
}

/**
 * To stop the alarm
 * @param {event object} event
 */
function stopAlarm(event) {
  let searchID = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchAlarmObject("id", searchID);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
}

/**
 * Delete the alarm object from alarm array
 * and from the DOM
 * @param {event object} e
 */
function deleteAlarm(e) {
  let searchID = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchAlarmObject("id", searchID);
  if (exists) {
    e.target.parentElement.remove();
    alarmsArray.splice(index, 1);
    alarmSound.pause();
  }
}

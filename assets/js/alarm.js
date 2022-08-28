// curly braces for block level scope
{
  // storing the HTML DOM elements in variables
  const currentTimeContainer = document.getElementById('current-time');
  const addAlarmButton = document.getElementById('add-alarm');
  const setAlarmContainer = document.getElementById('new-alarm');
  const cancelSetAlarmButton = document.getElementById('cancel-set-alarm');
  const newAlarmForm = document.getElementById('new-alarm-form');
  const hourSelector = document.getElementById('hr');
  const minuteSelector = document.getElementById('min');
  const secondSelector = document.getElementById('sec');
  const amPmSelector = document.getElementById('am-pm');
  const alarmList = document.getElementById('alarms');
  const clockContainer = document.getElementById('clock-container');

  // variable for storing the alarm times in an array
  let alarm = {
    times: []
  };

  // timer ID for setTimeout
  let timerId = null;

  // Function for removing an alarm
  const removeAlarm = function (event) {
    let button = event.target;
    let id = button.getAttribute('data-id');
    alarm.times.splice(id, 1);
    localStorage.setItem('alarm', JSON.stringify(alarm));
    fillAlarmList();
  };

  // Function for populating the alarm list with alarm times
  const fillAlarmList = function () {
    // clearing the list
    alarmList.innerHTML = '';

    // checking condition if alarm list is empty
    if (alarm.times.length === 0) {
      const noAlarms = document.createElement('h1');
      noAlarms.id = 'no-alarms';
      noAlarms.innerHTML = 'No alarms to display!';
      clockContainer.appendChild(noAlarms);
      return;
    }

    // removing 'no alarms found' message if it is present in DOM
    let noAlarm = document.getElementById('no-alarms');
    if (noAlarm != null) {
      noAlarm.remove();
    }

    // Filling alarm list in ascending order of alarm times.
    alarm.times.forEach(function (value, index) {
      const listItem = document.createElement('li');
      listItem.id = index;
      let seconds = value;
      let hours = (seconds - (seconds % 3600)) / 3600;
      seconds %= 3600;
      let minutes = (seconds - (seconds % 60)) / 60;
      seconds %= 60;
      const time = convertTo12Hour(hours, minutes, seconds);

      listItem.innerHTML = `<span class="alarm-time">${time}</span>
      <i class="fa-solid fa-eraser remove-alarm" title="remove alarm" data-id="${index}"></i>`;

      alarmList.appendChild(listItem);
      let removeButton = listItem.querySelector('.remove-alarm');
      removeButton.addEventListener('click', removeAlarm);
    });
  };

  // get previously set alarms from the localStorage if exists
  if (localStorage.getItem('alarm')) {
    alarm = JSON.parse(localStorage.getItem('alarm'));
  }

  // Function for converting alarm time to 12 hour format.
  // It takes hours, minutes and seconds as input and returns a time string
  const convertTo12Hour = function (hours, minutes, seconds) {
    // adding zeros at the beginning if it is single digit
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    if (hours < 12) {
      if (hours === 0) {
        return `12 : ${minutes} : ${seconds} AM`;
      } else {
        if (hours < 10) {
          hours = `0${hours}`;
        }
        return `${hours} : ${minutes} : ${seconds} AM`;
      }
    } else {
      if (hours === 12) {
        return `12 : ${minutes} : ${seconds} PM`;
      } else {
        hours -= 12;
        if (hours < 10) {
          hours = `0${hours}`;
        }
        return `${hours} : ${minutes} : ${seconds} PM`;
      }
    }
  };

  // Function for setting the timeout of the next alarm to ring.
  const ringNextAlarm = function () {
    if (alarm.times.length != 0) {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();

      // getting the current time in seconds.
      let timeInSeconds = hours * 3600 + minutes * 60 + seconds;

      // finding the next alarm to ring from the alarms list
      let nextAlarmTime = alarm.times.find(function (value, index) {
        return value >= timeInSeconds;
      });

      // if next alarm time is not found, set the next time to ring as the first entry of the alarms list
      if (nextAlarmTime == undefined) {
        nextAlarmTime = alarm.times[0];
        let alarmTimeOffset = 24 * 3600 - timeInSeconds + nextAlarmTime;
        timerId = setTimeout(ringAlarm, alarmTimeOffset * 1000, nextAlarmTime);
      } else {
        let alarmTimeOffset = nextAlarmTime - timeInSeconds;
        timerId = setTimeout(ringAlarm, alarmTimeOffset * 1000, nextAlarmTime);
      }
    }
  };

  // Function for ringing the alarm.
  // It takes the time as input when the alarm has to be ringed
  const ringAlarm = function (alarmTime) {
    // checking if the alarm time exists in the list.
    // If not exists i.e. the alarm has been removed by the user
    if (alarm.times.indexOf(alarmTime) != -1) {
      alert('Alarm ringing!');
    }

    // set the next alarm to ring
    ringNextAlarm();
  };

  // Show current time in DOM
  const showCurrentTime = function () {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeIn12HFormat = convertTo12Hour(hours, minutes, seconds);
    currentTimeContainer.innerHTML = timeIn12HFormat;
  };

  // Update the current time in DOM
  const updateCurrentTime = function () {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeIn12HFormat = convertTo12Hour(hours, minutes, seconds);
    currentTimeContainer.innerHTML = timeIn12HFormat;
  };

  // set the interval of updating time every 1 second.
  setInterval(updateCurrentTime, 1000);

  // Function for displaying new alarm box in DOM
  const showSetAlarm = function () {
    setAlarmContainer.style.display = 'block';

    const date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let dateString = convertTo12Hour(hh, mm, ss);

    hourSelector.value = dateString.slice(0, 2);
    minuteSelector.value = dateString.slice(5, 7);
    secondSelector.value = dateString.slice(10, 12);
    amPmSelector.value = dateString.slice(13, 15).toLowerCase();
  };

  // Function for hiding the new alarm box in DOM
  const hideSetAlarm = function () {
    setAlarmContainer.style.display = 'none';
  };

  // Compare function passed to sort function, for sorting the alarm times in ascending order
  const compareFunction = function (a, b) {
    return a - b;
  };

  // Function for adding an alarm to the alarms list
  const handleSetAlarm = function (event) {
    event.preventDefault();
    let hours = parseInt(hourSelector.value);
    let minutes = parseInt(minuteSelector.value);
    let seconds = parseInt(secondSelector.value);
    let totalSeconds = seconds;
    totalSeconds += minutes * 60;
    if (amPmSelector.value === 'am') {
      if (hours !== 12) {
        totalSeconds += hours * 60 * 60;
      }
    } else {
      if (hours === 12) {
        totalSeconds += hours * 60 * 60;
      } else {
        hours += 12;
        totalSeconds += hours * 60 * 60;
      }
    }

    // add alarm only if it does not exist
    if (alarm.times.indexOf(totalSeconds) == -1) {
      alarm.times.push(totalSeconds);
      alarm.times.sort(compareFunction);
      localStorage.setItem('alarm', JSON.stringify(alarm));

      // clearing the previous setTimeout if present
      if (timerId != null) {
        clearTimeout(timerId);
      }

      // set the timeout for the next alarm from the alarms list
      ringNextAlarm();

      // fill the alarms list in DOM
      fillAlarmList();
    }

    setAlarmContainer.style.display = 'none';
  };

  // attaching event listeners
  addAlarmButton.addEventListener('click', showSetAlarm);
  cancelSetAlarmButton.addEventListener('click', hideSetAlarm);
  newAlarmForm.addEventListener('submit', handleSetAlarm);

  // initialize the script
  showCurrentTime();
  fillAlarmList();
  ringNextAlarm();
}

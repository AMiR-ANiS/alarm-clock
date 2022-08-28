{
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
  let alarm = {
    times: []
  };
  let timerId = null;

  const removeAlarm = function (event) {
    let button = event.target;
    let id = button.getAttribute('data-id');
    alarm.times.splice(id, 1);
    localStorage.setItem('alarm', JSON.stringify(alarm));
    fillAlarmList();
  };

  const fillAlarmList = function () {
    alarmList.innerHTML = '';
    if (alarm.times.length === 0) {
      const noAlarms = document.createElement('h1');
      noAlarms.id = 'no-alarms';
      noAlarms.innerHTML = 'No alarms to display!';
      clockContainer.appendChild(noAlarms);
      return;
    }

    let noAlarm = document.getElementById('no-alarms');
    if (noAlarm != null) {
      noAlarm.remove();
    }

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

  if (localStorage.getItem('alarm')) {
    alarm = JSON.parse(localStorage.getItem('alarm'));
  }

  const convertTo12Hour = function (hours, minutes, seconds) {
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

  const ringNextAlarm = function () {
    if (alarm.times.length != 0) {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let timeInSeconds = hours * 3600 + minutes * 60 + seconds;
      let nextAlarmTime = alarm.times.find(function (value, index) {
        return value >= timeInSeconds;
      });

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

  const ringAlarm = function (alarmTime) {
    if (alarm.times.indexOf(alarmTime) != -1) {
      alert('Alarm ringing!');
    }
    ringNextAlarm();
  };

  const showCurrentTime = function () {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeIn12HFormat = convertTo12Hour(hours, minutes, seconds);
    currentTimeContainer.innerHTML = timeIn12HFormat;
  };

  const updateCurrentTime = function () {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timeIn12HFormat = convertTo12Hour(hours, minutes, seconds);
    currentTimeContainer.innerHTML = timeIn12HFormat;
  };

  setInterval(updateCurrentTime, 1000);

  const showSetAlarm = function () {
    setAlarmContainer.style.display = 'block';
  };

  const hideSetAlarm = function () {
    setAlarmContainer.style.display = 'none';
  };

  const compareFunction = function (a, b) {
    return a - b;
  };

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

    if (alarm.times.indexOf(totalSeconds) == -1) {
      alarm.times.push(totalSeconds);
      alarm.times.sort(compareFunction);
      localStorage.setItem('alarm', JSON.stringify(alarm));

      if (timerId != null) {
        clearInterval(timerId);
      }
      ringNextAlarm();
      fillAlarmList();
    }

    setAlarmContainer.style.display = 'none';
  };

  addAlarmButton.addEventListener('click', showSetAlarm);
  cancelSetAlarmButton.addEventListener('click', hideSetAlarm);
  newAlarmForm.addEventListener('submit', handleSetAlarm);

  showCurrentTime();
  fillAlarmList();
  ringNextAlarm();
}

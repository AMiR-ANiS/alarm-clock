{
  const currentTimeContainer = document.getElementById('current-time');
  const addAlarmButton = document.getElementById('add-alarm');
  const setAlarmContainer = document.getElementById('new-alarm');
  const cancelSetAlarmButton = document.getElementById('cancel-set-alarm');
  const newAlarmForm = document.getElementById('new-alarm-form');
  const alarm = {
    times: []
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

  const handleSetAlarm = function (event) {
    event.preventDefault();
  };

  addAlarmButton.addEventListener('click', showSetAlarm);
  cancelSetAlarmButton.addEventListener('click', hideSetAlarm);
  newAlarmForm.addEventListener('submit', handleSetAlarm);
}

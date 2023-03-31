import { timer } from "./timer.js";

let interval;

const timerButtons = document.querySelectorAll(".timer-button");

for(let button of timerButtons){
  button.addEventListener("click", handleTimer)
}

const statusButton = document.querySelector(".start-button");
statusButton.addEventListener("click", handleStatusButton);

function handleTimer(event){
  const timer = event.target.dataset.time;

  if(!timer){
    return;
  }
  setTimer(timer)
  clearInterval(interval);
  if(statusButton.dataset.status === "stop"){
  handleStatusButton({target: document.querySelector(".start-button")})
  }
}

function handleStatusButton(event){
  const status = event.target.dataset.status;
  if(!status){
    return;
  }

  if(status === "start"){
    startTimer();
    event.target.dataset.status = "stop";
    event.target.textContent = "Stop";
  } else {
    clearInterval(interval);
    event.target.dataset.status = "start";
    event.target.textContent = "Start";
  }
}


function setTimer(mode){
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  const activeButtons = document.querySelectorAll("button[data-time]");
  for(let button of activeButtons){
    button.classList.remove("active");
  }

  document.querySelector(`[data-time=${mode}]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`

  updateClock();
}

function updateClock() {
  const {remainingTime, mode} = timer;

  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const minutesElem = document.querySelector('.minutes');
  const secondsElem = document.querySelector('.seconds');

  minutesElem.textContent = minutes;
  secondsElem.textContent = seconds;

  const title = timer.mode === 'pomodoro' ? 'Time to work !' :  'Take a break !'
  document.title = `${minutes}:${seconds} - ${title}`;

  const totalMode = timer[mode] * 60;

  const progressBar = document.querySelector('.progress-bar-fill');
  progressBar.style.width = `${(totalMode - remainingTime.total) * 100 / totalMode}%` ;

};

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.now() + total * 1000;

  if(timer.mode === 'pomodoro'){
    timer.sessions++;
  }

  interval = setInterval(() => {
    timer.remainingTime = getTimeRemaining(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if(total <= 0){
      clearInterval(interval);
      alert(`${timer.mode} is over !`)

      switch (timer.mode) {
        case "pomodoro":
          if(timer.sessions % timer.interval === 0){
            setTimer("longBreak");
            startTimer();
          } else {
            setTimer("shortBreak");
            startTimer();
          } 
          break;
          default:
            setTimer("pomodoro");
            startTimer();    
      }
    }
  }, 1000);


};

function getTimeRemaining(endTime) {
  const currentTime = Date.now();
  const difference = endTime - currentTime;

  const total = parseInt(difference / 1000, 10);
  const minutes = parseInt((difference / 1000 / 60) % 60, 10);
  const seconds = parseInt((difference / 1000) % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

/* TASKS */

const formTaskElem = document.querySelector(".form-task");
formTaskElem.addEventListener("submit", handleFormTask);

function handleFormTask(event){
  event.preventDefault();

  const input = event.target.querySelector("input");
  const task = input.value;
  if(task){
    addTask(task);
    input.value = "";
  }
}

function addTask(task){
  const tasksContainer = document.querySelector(".tasks-container");

  const taskElem = document.createElement('label')
  taskElem.classList.add('task')
  const checkBoxElem = document.createElement('input')
  checkBoxElem.type = 'checkbox'
  checkBoxElem.classList.add('task-checkbox')

  const taskTextElem = document.createElement('span')
  taskTextElem.classList.add('task-name')
  taskTextElem.textContent = task

  taskElem.appendChild(checkBoxElem);
  taskElem.appendChild(taskTextElem);

  tasksContainer.appendChild(taskElem);

}

window.onload = () => {
    document.querySelectorAll("button.particleButton").forEach(btn => {
        let btnBg = btn.parentNode.querySelector(".particles")
        let initalListener = () => {
            btnBg.classList.add("animated")
            btn.removeEventListener("click", initalListener)
        }
        btn.addEventListener("click", initalListener)
    })
}

document.addEventListener("DOMContentLoaded", () => {
  setTimer("pomodoro");
});
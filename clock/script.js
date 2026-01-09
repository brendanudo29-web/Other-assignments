const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");
const numbersContainer = document.querySelector(".numbers");

/* CREATE NUMBERS 1–12 */
for (let i = 1; i <= 12; i++) {
  const number = document.createElement("div");
  number.classList.add("number");
  number.textContent = i;

  const angle = (i * 30) * (Math.PI / 180);
  const radius = 110;

  const x = 125 + radius * Math.sin(angle) - 8;
  const y = 125 - radius * Math.cos(angle) - 8;

  number.style.left = `${x}px`;
  number.style.top = `${y}px`;

  numbersContainer.appendChild(number);
}

/* UPDATE CLOCK */
function updateClock() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  secondHand.style.transform = `rotate(${secondDeg}deg)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  hourHand.style.transform = `rotate(${hourDeg}deg)`;
}

setInterval(updateClock, 1000);
updateClock();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load background image (messy desk)
const bgImage = new Image();
bgImage.src = "./assests/image.png"; // make sure folder name is correct (assets, not assests)

// Objects to find (bounding boxes)
const objects = [
  { name: "CD", x: 90, y: 370, width: 50, height: 50, found: false },
  { name: "Bottle", x: 365, y: 190, width: 30, height: 60, found: false },
  { name: "Book", x: 580, y: 410, width: 60, height: 40, found: false }, 
  { name: "Files", x: 600, y: 120, width: 100, height: 100, found: false },   
  { name: "Phone", x: 280, y: 170, width: 40, height: 100, found: false },
];

// Sidebar elements
const objectList = document.getElementById("object-list");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");

let score = 0;
let timeLeft = 60;
let interval = null;
let debugMode = true; // 👈 toggle this to true/false to see boxes

// Populate object list
function populateList() {
  objectList.innerHTML = "";
  objects.forEach(obj => {
    const li = document.createElement("li");
    li.textContent = obj.name;
    li.id = `obj-${obj.name}`;
    objectList.appendChild(li);
  });
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // Draw object boxes
  objects.forEach(obj => {
    if (obj.found) {
      // Green highlight for found
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    } else if (debugMode) {
      // Red outline for testing
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    }
  });
}

// Check if clicked inside object
function isInsideObject(obj, x, y) {
  return (
    x >= obj.x &&
    x <= obj.x + obj.width &&
    y >= obj.y &&
    y <= obj.y + obj.height
  );
}

// Handle clicks
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  // Scale click to canvas size
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  objects.forEach(obj => {
    if (!obj.found && isInsideObject(obj, x, y)) {
      obj.found = true;
      score++;
      document.getElementById(`obj-${obj.name}`).classList.add("found");
      scoreEl.textContent = score;
    }
  });

  draw();
});

// Timer
function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0 || score === objects.length) {
      clearInterval(interval);
      setTimeout(() => {
        alert(score === objects.length ? "🎉 You found all objects!" : "⏳ Time’s up!");
      }, 200);
    }
  }, 1000);
}

// Restart game
function restartGame() {
  score = 0;
  timeLeft = 60;
  objects.forEach(obj => (obj.found = false));
  populateList();
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  clearInterval(interval);
  draw();
  startTimer();
}

// Start game after image loads
bgImage.onload = () => {
  populateList();
  draw();
  startTimer();
};

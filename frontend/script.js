let score = 0;
let foundDifferences = new Set(); // Track which differences have been found
let timeLeft = 60;
let timerInterval;

// Simulated differences (we'll replace this with AI-generated data later)
const differences = [
  { x: 100, y: 150, radius: 20, id: 1 },
  { x: 250, y: 200, radius: 25, id: 2 },
  { x: 350, y: 100, radius: 15, id: 3 }
];

function drawMarker(canvas, x, y, color = 'red') {
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function isNearDifference(x, y, tolerance = 30) {
  for (let diff of differences) {
    const distance = Math.sqrt((x - diff.x) ** 2 + (y - diff.y) ** 2);
    if (distance <= tolerance && !foundDifferences.has(diff.id)) {
      return diff;
    }
  }
  return null;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Time\'s up! Game Over!');
      // Optionally reset the game
      resetGame();
    }
  }, 1000);
}

function resetGame() {
  score = 0;
  foundDifferences.clear();
  timeLeft = 60;
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: 60s';
  updateDifferencesLeft();
  
  // Clear the canvases
  const canvas1 = document.getElementById('canvas1');
  const canvas2 = document.getElementById('canvas2');
  canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height);
  canvas2.getContext('2d').clearRect(0, 0, canvas2.width, canvas2.height);
  
  // Restart the timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  startTimer();
}

function handleImageClick(event, canvas) {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Check if click is near a difference
  const foundDiff = isNearDifference(x, y);
  
  if (foundDiff) {
    // Correct click!
    drawMarker(canvas, x, y, 'green');
    foundDifferences.add(foundDiff.id);
    score += 10;
    alert(`Great! You found difference ${foundDiff.id}!`);
  } else {
    // Incorrect click
    drawMarker(canvas, x, y, 'red');
    score = Math.max(0, score - 1); // Don't go below 0
  }

  document.getElementById('score').textContent = `Score: ${score}`;
  updateDifferencesLeft();
  
  // Check if all differences are found
  if (foundDifferences.size === differences.length) {
    clearInterval(timerInterval);
    alert('Congratulations! You found all the differences!');
  }
}

function updateDifferencesLeft() {
  const remaining = differences.length - foundDifferences.size;
  document.getElementById('differences-left').textContent = `Differences left: ${remaining}`;
}

window.onload = function() {
  const img1 = document.getElementById('image1');
  const img2 = document.getElementById('image2');
  const canvas1 = document.getElementById('canvas1');
  const canvas2 = document.getElementById('canvas2');

  img1.addEventListener('click', (e) => handleImageClick(e, canvas1));
  img2.addEventListener('click', (e) => handleImageClick(e, canvas2));
  
  // Start the timer
  startTimer();
};

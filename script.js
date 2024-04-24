document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  if (canvas) {
    console.log("Canvas is initialized:", canvas);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      console.log("2D context is available");
    } else {
      console.log("2D context is not available");
    }
  } else {
    console.log("Canvas element not found");
  }

  let ball = {
    x: Math.random() * (canvas.width - 30) + 15, // 15 is the radius of the ball
    y: Math.random() * (canvas.height - 30) + 15,
    radius: 15,
    dx: 5,
    dy: 5,
  };

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }
  }

  setInterval(update, 20);

  document.getElementById("increaseSpeed").addEventListener("click", () => {
    ball.dx *= 1.1;
    ball.dy *= 1.1;
  });

  document.getElementById("decreaseSpeed").addEventListener("click", () => {
    ball.dx *= 0.9;
    ball.dy *= 0.9;
  });
});

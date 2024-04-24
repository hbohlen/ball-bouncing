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

  // Initialize an array of balls
  let balls = [];
  // Function to add a new ball
  function addBall() {
    balls.push({
      x: Math.random() * (canvas.width - 30) + 15,
      y: Math.random() * (canvas.height - 30) + 15,
      radius: 15,
      dx: (Math.random() - 0.5) * 10,
      dy: (Math.random() - 0.5) * 10,
      mass: 1,
    });
  }

  // Function to remove a ball
  function removeBall() {
    if (balls.length > 0) {
      balls.pop(); // Removes the last ball from the array
    }
  }

  // Initially populate the array with some balls
  for (let i = 0; i < 5; i++) {
    addBall();
  }

  // Add event listeners to buttons
  document.getElementById("addBall").addEventListener("click", addBall);
  document.getElementById("removeBall").addEventListener("click", removeBall);

  function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
      drawBall(ball);
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Bounce off the walls
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }
    });

    // Handle collisions between balls
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        let dx = balls[i].x - balls[j].x;
        let dy = balls[i].y - balls[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < balls[i].radius + balls[j].radius) {
          // Move balls apart before calculating new velocities to prevent sticking
          let overlap = 0.5 * (distance - balls[i].radius - balls[j].radius);
          balls[i].x -= (overlap * (balls[i].x - balls[j].x)) / distance;
          balls[i].y -= (overlap * (balls[i].y - balls[j].y)) / distance;
          balls[j].x += (overlap * (balls[i].x - balls[j].x)) / distance;
          balls[j].y += (overlap * (balls[i].y - balls[j].y)) / distance;

          // Calculate normal and tangential velocities
          let normal = { x: dx / distance, y: dy / distance };
          let tangent = { x: -normal.y, y: normal.x };

          let dpTan1 = balls[i].dx * tangent.x + balls[i].dy * tangent.y;
          let dpTan2 = balls[j].dx * tangent.x + balls[j].dy * tangent.y;

          let dpNorm1 = balls[i].dx * normal.x + balls[i].dy * normal.y;
          let dpNorm2 = balls[j].dx * normal.x + balls[j].dy * normal.y;

          // Conservation of momentum in 1D
          let m1 =
            (dpNorm1 * (balls[i].mass - balls[j].mass) +
              2 * balls[j].mass * dpNorm2) /
            (balls[i].mass + balls[j].mass);
          let m2 =
            (dpNorm2 * (balls[j].mass - balls[i].mass) +
              2 * balls[i].mass * dpNorm1) /
            (balls[i].mass + balls[j].mass);

          balls[i].dx = tangent.x * dpTan1 + normal.x * m1;
          balls[i].dy = tangent.y * dpTan1 + normal.y * m1;
          balls[j].dx = tangent.x * dpTan2 + normal.x * m2;
          balls[j].dy = tangent.y * dpTan2 + normal.y * m2;

          // Introduce slight randomness to prevent deterministic paths
          balls[i].dx += (Math.random() - 0.5) * 0.2;
          balls[i].dy += (Math.random() - 0.5) * 0.2;
          balls[j].dx += (Math.random() - 0.5) * 0.2;
          balls[j].dy += (Math.random() - 0.5) * 0.2;
        }
      }
    }
  }

  setInterval(update, 20);

  document.getElementById("increaseSpeed").addEventListener("click", () => {
    balls.forEach((ball) => {
      ball.dx *= 1.1;
      ball.dy *= 1.1;
    });
  });

  document.getElementById("decreaseSpeed").addEventListener("click", () => {
    balls.forEach((ball) => {
      ball.dx *= 0.9;
      ball.dy *= 0.9;
    });
  });
});

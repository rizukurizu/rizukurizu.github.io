// Set up canvas for stars
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const starCount = 200;

// Mouse tracking
const mouse = {
    x: null,
    y: null,
    radius: 100
};

// Track mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Load hover settings from local storage
let hoverEnabled = localStorage.getItem('hoverEnabled') === 'true';

// Generate random number in range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Create stars
function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            radius: random(0.5, 1.5),
            color: `rgba(${random(150, 255)}, ${random(150, 255)}, ${random(150, 255)}, 1)`,
            dx: random(-0.5, 0.5),
            dy: random(-0.5, 0.5),
            rotation: random(0, 360),
            rotationSpeed: random(0.005, 0.02)
        });
    }
}

// Draw stars
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        ctx.save();

        // Apply rotation
        ctx.translate(star.x, star.y);
        ctx.rotate(star.rotation);
        ctx.translate(-star.x, -star.y);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();

        ctx.restore();

        // Update rotation
        star.rotation += star.rotationSpeed;

        // Hover effect
        if (hoverEnabled) {
            const distX = mouse.x - star.x;
            const distY = mouse.y - star.y;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < mouse.radius) {
                star.x -= distX * 0.05;
                star.y -= distY * 0.05;
            }
        }

        // Movement
        star.x += star.dx;
        star.y += star.dy;

        // Rebound stars on edges
        if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
    });

    requestAnimationFrame(drawStars);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

// Toggle hover effect and save preference
window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        hoverEnabled = !hoverEnabled;
        localStorage.setItem('hoverEnabled', hoverEnabled);
        console.log(`Hover effect: ${hoverEnabled ? 'Enabled' : 'Disabled'}`);
    }
});

// Initialize stars and animation
createStars();
drawStars();

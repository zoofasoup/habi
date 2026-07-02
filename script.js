document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    
    // Screens and UI
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const uiLayer = document.getElementById('ui-layer');
    const scoreSpan = document.getElementById('score');
    const livesSpan = document.getElementById('lives');
    const finalScoreSpan = document.getElementById('final-score');
    const endTitle = document.getElementById('end-title');
    const waitlistSection = document.getElementById('waitlist-section');
    
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    // Form
    const form = document.getElementById('notify-form');
    const inputGroup = document.querySelector('.input-group');
    const successMsg = document.getElementById('success-msg');
    
    // Game State
    let animationId;
    let isPlaying = false;
    let score = 0;
    let lives = 3;
    let frameCount = 0;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Images
    const logoImg = document.getElementById('logo-img');
    
    // Player
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 80,
        height: 80,
        speed: 10,
        draw() {
            if (logoImg.complete && logoImg.naturalHeight !== 0) {
                // Draw logo as player
                ctx.drawImage(logoImg, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
            } else {
                // Fallback drawing
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
                ctx.fillStyle = '#a4ce3a';
                ctx.fill();
                ctx.closePath();
            }
        }
    };
    
    // Mouse / Touch movement
    function handleMove(e) {
        if (!isPlaying) return;
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const rect = canvas.getBoundingClientRect();
        let targetX = clientX - rect.left;
        
        // Keep within bounds
        targetX = Math.max(player.width/2, Math.min(canvas.width - player.width/2, targetX));
        player.x = targetX;
    }
    
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    
    // Falling Objects
    const objects = [];
    class FallingObject {
        constructor() {
            this.radius = 15 + Math.random() * 15;
            this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
            this.y = -this.radius;
            this.speed = 2 + Math.random() * 4 + (score * 0.05); // Speed increases with score
            this.type = Math.random() > 0.3 ? 'herb' : 'rock'; // 70% herbs, 30% rocks
            
            // Colors
            this.color = this.type === 'herb' ? '#7da328' : '#777777';
        }
        
        draw() {
            ctx.beginPath();
            if (this.type === 'herb') {
                // Draw a leaf shape
                ctx.ellipse(this.x, this.y, this.radius/2, this.radius, 0, 0, Math.PI * 2);
            } else {
                // Draw a rock
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            }
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
        update() {
            this.y += this.speed;
            this.draw();
        }
    }
    
    // Game Loop
    function gameLoop() {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        player.draw();
        
        // Add new objects
        frameCount++;
        if (frameCount % Math.max(20, 60 - score) === 0) { // Spawn faster as score increases
            objects.push(new FallingObject());
        }
        
        // Update objects & check collisions
        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i];
            obj.update();
            
            // Collision detection
            const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
            if (dist - obj.radius - player.width/2.5 < 0) { // Slight forgiveness in collision
                if (obj.type === 'herb') {
                    score += 5;
                    scoreSpan.innerText = score;
                } else {
                    lives -= 1;
                    livesSpan.innerText = lives;
                    
                    // Shake effect
                    canvas.style.transform = 'translateX(5px)';
                    setTimeout(() => canvas.style.transform = 'translateX(-5px)', 50);
                    setTimeout(() => canvas.style.transform = 'translateX(5px)', 100);
                    setTimeout(() => canvas.style.transform = 'none', 150);
                }
                objects.splice(i, 1);
                
                if (lives <= 0) {
                    endGame();
                    return;
                }
            }
            
            // Remove if off screen
            if (obj.y > canvas.height + obj.radius) {
                if (obj.type === 'herb') {
                    // Missed an herb!
                    lives -= 1;
                    livesSpan.innerText = lives;
                    if (lives <= 0) {
                        endGame();
                        return;
                    }
                }
                objects.splice(i, 1);
            }
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function startGame() {
        startScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
        uiLayer.style.display = 'flex';
        canvas.style.cursor = 'none';
        
        score = 0;
        lives = 3;
        objects.length = 0; // Clear array
        frameCount = 0;
        
        scoreSpan.innerText = score;
        livesSpan.innerText = lives;
        
        player.x = canvas.width / 2;
        player.y = canvas.height - 80;
        
        isPlaying = true;
        gameLoop();
    }
    
    function endGame() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        
        uiLayer.style.display = 'none';
        canvas.style.cursor = 'default';
        gameOverScreen.classList.add('active');
        finalScoreSpan.innerText = score;
        
        if (score >= 50) {
            endTitle.innerText = "Amazing Catch!";
            waitlistSection.style.display = 'block';
        } else {
            endTitle.innerText = "Game Over";
            waitlistSection.style.display = 'none';
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        if (email) {
            const btn = document.getElementById('notify-btn');
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                inputGroup.style.display = 'none';
                successMsg.style.display = 'block';
            }, 800);
        }
    });
});

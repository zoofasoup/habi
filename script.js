document.addEventListener('DOMContentLoaded', () => {
    const plantContainer = document.getElementById('plant-container');
    const waitlistCard = document.getElementById('waitlist-card');
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    
    let clicks = 0;
    const maxClicks = 6;
    let isFullyGrown = false;

    // Create a water drop effect
    function createDrop(x, y) {
        const drop = document.createElement('div');
        drop.classList.add('water-drop');
        drop.style.left = x + 'px';
        drop.style.top = y + 'px';
        
        // Slight randomness to position
        drop.style.transform = `rotate(-45deg) translate(${Math.random() * 20 - 10}px, ${Math.random() * -20}px)`;
        
        plantContainer.appendChild(drop);
        
        setTimeout(() => {
            drop.remove();
        }, 600);
    }

    // Handle clicks
    plantContainer.addEventListener('click', (e) => {
        if (isFullyGrown) return;

        // Get relative click position
        const rect = plantContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        createDrop(x, y);

        clicks++;
        
        // Update Progress Bar
        const progressPercentage = (clicks / maxClicks) * 100;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;

        // Update Plant Stages
        let currentStage = 0;
        if (clicks >= 2 && clicks < 4) currentStage = 1;
        if (clicks >= 4 && clicks < 6) currentStage = 2;
        if (clicks >= 6) currentStage = 3;

        // Hide all stages
        document.querySelectorAll('.plant-stage').forEach(el => el.classList.remove('active'));
        // Show current stage
        document.getElementById(`stage-${currentStage}`).classList.add('active');

        // Text updates
        if (clicks === 2) mainSubtitle.innerText = "It's sprouting! Keep nurturing...";
        if (clicks === 4) mainSubtitle.innerText = "Almost there, a little more water...";
        
        // Bloom!
        if (clicks >= maxClicks) {
            isFullyGrown = true;
            mainTitle.innerText = "It has bloomed.";
            mainSubtitle.innerText = "";
            plantContainer.style.cursor = 'default';
            
            setTimeout(() => {
                const bloomedLogo = document.querySelector('.bloomed-logo');
                const formLogo = document.getElementById('form-logo');
                
                // Stop the pulsing animation so we measure its exact unscaled size
                bloomedLogo.style.animation = 'none';
                bloomedLogo.style.transform = 'scale(1)';
                
                // Force a layout recalculation
                bloomedLogo.offsetHeight;

                // Get starting bounds before any layout changes
                const startBounds = bloomedLogo.getBoundingClientRect();
                
                // Hide plant container softly using class (preserves its layout space in grid)
                plantContainer.classList.add('hidden');
                
                // Show waitlist card so browser can calculate its layout instantly
                waitlistCard.classList.remove('hidden');
                
                // Wait for the browser to render the now-visible grid
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const targetBounds = formLogo.getBoundingClientRect();
                        
                        // Create clone
                        const flyingLogo = document.createElement('img');
                        flyingLogo.src = 'logo.png';
                        flyingLogo.className = 'flying-logo';
                        flyingLogo.style.left = startBounds.left + 'px';
                        flyingLogo.style.top = startBounds.top + 'px';
                        flyingLogo.style.width = startBounds.width + 'px';
                        flyingLogo.style.height = startBounds.height + 'px';
                        document.body.appendChild(flyingLogo);

                        // Force reflow
                        flyingLogo.offsetHeight;

                        // Fly to target
                        flyingLogo.style.left = targetBounds.left + 'px';
                        flyingLogo.style.top = targetBounds.top + 'px';
                        flyingLogo.style.width = targetBounds.width + 'px';
                        flyingLogo.style.height = targetBounds.height + 'px';
                        
                        // Clean up after flight
                        setTimeout(() => {
                            formLogo.style.opacity = '1';
                            flyingLogo.remove();
                            plantContainer.style.display = 'none'; // Finally remove from DOM flow
                        }, 1200);
                    });
                });
            }, 1000);
        }
    });

    // Form logic
    const form = document.getElementById('notify-form');
    const inputGroup = document.querySelector('.input-group');
    const successMsg = document.getElementById('success-msg');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value.trim();
        
        // Ensure valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMsg.innerText = 'Please enter a valid email address.';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Check if already registered
        if (localStorage.getItem('registered_email') === email) {
            errorMsg.innerText = "You're already on the waitlist with this email!";
            errorMsg.style.display = 'block';
            return;
        }
        
        errorMsg.style.display = 'none';
        
        if (email) {
            const btn = document.getElementById('notify-btn');
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';

            const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSe6eTwVP-Al2e7_tS5odo-65FDy3Xrs166RZ-FCMUGSua0UdA/formResponse';
            const data = new URLSearchParams();
            data.append('entry.1634781358', email);

            fetch(formURL, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            }).then(() => {
                localStorage.setItem('registered_email', email);
                inputGroup.style.display = 'none';
                successMsg.style.display = 'block';
            }).catch(err => {
                // Even if it fails locally due to some strict browser plugin, we show success to not confuse users
                localStorage.setItem('registered_email', email);
                inputGroup.style.display = 'none';
                successMsg.style.display = 'block';
            });
        }
    });
});

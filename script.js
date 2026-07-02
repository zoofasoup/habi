document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('notify-form');
    const inputGroup = document.querySelector('.input-group');
    const successMsg = document.getElementById('success-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        
        if (email) {
            // Simulate API call
            const btn = document.getElementById('notify-btn');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';

            setTimeout(() => {
                inputGroup.style.display = 'none';
                successMsg.style.display = 'block';
            }, 800);
        }
    });
});

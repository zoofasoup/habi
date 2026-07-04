document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 60), { passive: true });
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('in'), (i % 6) * 80);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .1 });

    document.querySelectorAll('.up').forEach(el => obs.observe(el));

    // Expose faq function globally so inline onclick works
    window.faq = function(b) {
        const a = b.nextElementSibling;
        const ic = b.querySelector('.fi-ico');
        const o = a.classList.contains('open');
        document.querySelectorAll('.fa').forEach(x => x.classList.remove('open'));
        document.querySelectorAll('.fi-ico').forEach(x => x.classList.remove('open'));
        if (!o) {
            a.classList.add('open');
            if (ic) ic.classList.add('open');
        }
    };

    const pe = document.getElementById('promoEnd');
    if (pe) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        pe.textContent = days[d.getDay()] + ', ' + d.getDate() + ' ' + mo[d.getMonth()];
    }

    let st = 47;
    setInterval(() => {
        if (Math.random() < .12 && st > 30) {
            st--;
            const el = document.getElementById('stockNum');
            if (el) el.textContent = st;
        }
    }, 9000);

    // Initialize Swiper
    if (typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            loop: true,
            centeredSlides: true,
            slidesPerView: "auto",
            spaceBetween: 30,
            grabCursor: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.tn-next',
                prevEl: '.tn-prev',
            }
        });
    }
    // Meta Pixel Event Tracking
    // 1. ViewContent — fire once when #product scrolls into view
    const prodSection = document.getElementById('product');
    if (prodSection) {
        const prodObserver = new IntersectionObserver(([entry], observer) => {
            if (entry.isIntersecting) {
                if (typeof fbq === 'function') {
                    fbq('track', 'ViewContent', { content_name: 'Habi Herbal Alam', content_type: 'product' });
                }
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        prodObserver.observe(prodSection);
    }

    // 2. InitiateCheckout — any .pb (platform buy) click
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.pb');
        if (!btn) return;
        if (typeof fbq === 'function') {
            fbq('track', 'InitiateCheckout', { content_name: 'Habi Herbal Alam' });
        }
    });

    // 3. AddToCart — any .btn.lime in product section click
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.prod-card .btn');
        if (!btn) return;
        if (typeof fbq === 'function') {
            fbq('track', 'AddToCart', { content_name: 'Habi Herbal Alam Package' });
        }
    });
});

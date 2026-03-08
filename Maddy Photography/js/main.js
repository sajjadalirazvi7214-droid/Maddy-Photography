/* ============================================
   Main Application — Init, GSAP, Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations immediately
    initGSAPAnimations();

    // Initialize 3D Studio
    if (window.Studio3D && document.getElementById('studio-canvas')) {
        new Studio3D();
    }

    // Initialize Video Manager
    if (window.VideoManager) {
        new VideoManager();
    }

    // Initialize Gallery
    if (window.Gallery && document.getElementById('lightbox')) {
        new Gallery();
    }

    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Hero idle animation with GSAP
    function initGSAPAnimations() {
        if (!window.gsap) return;

        // Register ScrollTrigger
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Hero photographer floating
        const heroPhotographer = document.querySelector('.hero-photographer');
        if (heroPhotographer) {
            gsap.to(heroPhotographer, {
                y: -10,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });

            // Subtle breathing scale
            gsap.to(heroPhotographer, {
                scale: 1.02,
                duration: 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });
        }

        // Hero content fade in
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && heroContent.children.length > 0) {
            gsap.fromTo(heroContent.children,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.1,
                    clearProps: "all" // Clears inline styles after animation to prevent issues
                }
            );
        }

        // Scroll-triggered reveals
        if (window.ScrollTrigger) {
            // Section headers
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.from(header.children, {
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                });
            });

            // Gallery items
            gsap.utils.toArray('.gallery-item').forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.7,
                    delay: (i % 3) * 0.1,
                    ease: 'power2.out',
                });
            });

            // Video cards
            gsap.utils.toArray('.video-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: 'power2.out',
                });
            });

            // Service cards
            gsap.utils.toArray('.service-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                    y: 50,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: 'power2.out',
                });
            });

            // Contact items
            gsap.utils.toArray('.contact-item').forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                    x: -40,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: 'power2.out',
                });
            });

            // Contact map
            const mapEl = document.querySelector('.contact-map');
            if (mapEl) {
                gsap.from(mapEl, {
                    scrollTrigger: {
                        trigger: mapEl,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                    x: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            }
        }
    }
});

// --- Developer Email Fallback ---
document.addEventListener('DOMContentLoaded', () => {
    const emailLink = document.getElementById('dev-email-link');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'sajjadalirazvi7214@gmail.com';
            // Try window.open first (most reliable cross-browser)
            const mailWindow = window.open('mailto:' + email, '_self');
            // If window.open returns null or doesn't trigger mail client, 
            // fall back to copying email to clipboard
            setTimeout(() => {
                navigator.clipboard.writeText(email).then(() => {
                    // Show a small toast notification
                    const toast = document.createElement('div');
                    toast.textContent = '📧 Email copied to clipboard: ' + email;
                    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(212,175,55,0.95);color:#000;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                });
            }, 500);
        });
    }
});

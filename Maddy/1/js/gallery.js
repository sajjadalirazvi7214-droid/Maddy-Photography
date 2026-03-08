/* ============================================
   Photo Gallery + Lightbox
   ============================================ */

class Gallery {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxCounter = document.getElementById('lightbox-counter');
        this.items = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.items = Array.from(document.querySelectorAll('.gallery-item'));

        this.items.forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));
        });

        // Close
        document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });

        // Navigation
        document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        document.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch swipe
        let touchStartX = 0;
        this.lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        this.lightbox.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        });
    }

    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.style.display = 'flex';
        // Force reflow so transition triggers
        void this.lightbox.offsetHeight;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // GSAP animate in
        if (window.gsap) {
            gsap.fromTo(this.lightboxImg,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        }
    }

    close() {
        if (window.gsap) {
            gsap.to(this.lightboxImg, {
                scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: () => {
                    this.lightbox.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        } else {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateImage();
    }

    updateImage() {
        const item = this.items[this.currentIndex];
        const img = item.querySelector('img');
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
        this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;

        if (window.gsap) {
            gsap.fromTo(this.lightboxImg,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
            );
        }
    }
}

window.Gallery = Gallery;

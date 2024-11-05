import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.hero', {
        duration: 1.5,
        opacity: 0,
        y: -100,
        ease: 'power3.out',
    });

    gsap.from('.feature', {
        duration: 1,
        opacity: 0,
        x: -100,
        stagger: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.feature',
            start: 'top 80%',
            toggleActions: 'play none none none',
        },
    });

    gsap.to('.parallax', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.parallax',
            start: 'top bottom',
            scrub: true,
        },
    });
}); 
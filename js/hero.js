// hero.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Select elements
  const heroImgContainer = document.querySelector(".hero-img");
  const heroImages = document.querySelectorAll(".hero-img img");
  let currentImageIndex = 0;
  const totalImages = heroImages.length;
  let scrollTriggerInstance = null; // Stores ScrollTrigger instance for cleanup

  let slideshowInterval = null;

  const startSlideshow = () => {
    if (slideshowInterval) return; // Already running
    slideshowInterval = setInterval(() => {
      heroImages[currentImageIndex].classList.remove("active");
      currentImageIndex = (currentImageIndex + 1) % totalImages;
      heroImages[currentImageIndex].classList.add("active");
    }, 1000);
  };

  const stopSlideshow = () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  };

  // Cycle through preloaded images every 1000ms using opacity fades
  if (totalImages > 0) {
    startSlideshow();

    let scrollTimeout = null;
    window.addEventListener("scroll", () => {
      stopSlideshow();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        startSlideshow();
      }, 300);
    });
  }

  // Initialize animations with ScrollTrigger
  const initAnimations = () => {
    // Kill existing ScrollTrigger instance to prevent duplicates
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    if (!heroImgContainer) return;

    // Create a direct, highly-optimized scrubbed tween on the cached container with linear ease
    scrollTriggerInstance = gsap.fromTo(
      heroImgContainer,
      {
        y: "-110%",
        scale: 0.25,
        rotation: -15,
      },
      {
        y: "0%",
        scale: 1,
        rotation: 0,
        ease: "none", // Ensures linear motion direct with scroll ticks
        scrollTrigger: {
          trigger: ".hero-img-holder", // Element that triggers animation
          start: "top bottom", // Animation starts when top of trigger hits bottom of viewport
          end: "top top", // Animation ends when top of trigger hits top of viewport
          scrub: true, // Tie animation directly to scroll position natively
        },
      }
    ).scrollTrigger;
  };

  // Run animations on page load
  initAnimations();

  // Track window width to prevent height-only resizes (mobile address bar) from restarting ScrollTrigger
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      initAnimations();
    }
  });
});
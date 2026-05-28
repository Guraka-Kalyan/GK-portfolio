// featured-work.js

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

  let scrollTriggerInstance = null; // Stores ScrollTrigger instance for cleanup

  // Initialize animations
  const initAnimations = () => {
    // Disable animations on small screens (width <= 1000px) and fallback to CSS stack
    if (window.innerWidth <= 1000) {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill(); // Clean up existing ScrollTrigger
        scrollTriggerInstance = null;
      }
      return;
    }

    // Kill existing ScrollTrigger instance to prevent duplicates
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Create section indicators (e.g., "01", "02", ..., "06") and progress dots
    const indicatorContainer = document.querySelector(".featured-work-indicator");
    indicatorContainer.innerHTML = ""; // Clear existing content
    for (let section = 1; section <= 6; section++) {
      // Add section number
      const sectionNumber = document.createElement("p");
      sectionNumber.className = "mn";
      sectionNumber.textContent = `0${section}`;
      indicatorContainer.appendChild(sectionNumber);
      // Add 6 progress indicators per section
      for (let i = 0; i < 6; i++) {
        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicatorContainer.appendChild(indicator);
      }
    }

    const detailCards = document.querySelectorAll(".project-details-card");
    const mockupImages = document.querySelectorAll(".browser-img-container img");
    const urlText = document.querySelector(".browser-url-bar .url-text");

    const projectUrls = [
      "venturemond.com",
      "stacli.com",
      "pinaka-retail (NDA Secured)",
      "pinaka-farm (NDA Secured)",
      "leadmanager (Open Source)",
      "insight-ai.kalyangk.online (Open Source)"
    ];

    let currentActiveIndex = 0; // Tracks the currently active project card index

    // Initialize layout states for desktop
    gsap.set(detailCards, { opacity: 0, y: 50, display: "none" });
    gsap.set(mockupImages, { opacity: 0, scale: 0.95 });

    // Activate the first project immediately
    gsap.set(detailCards[0], { opacity: 1, y: 0, display: "flex" });
    gsap.set(mockupImages[0], { opacity: 1, scale: 1 });
    urlText.textContent = projectUrls[0];

    // Create ScrollTrigger for split-screen panel morphing
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".featured-work", // Trigger element
      start: "top top", // Pin immediately when section hits top of viewport
      end: `+=${window.innerHeight * 5}px`, // Pinned for 5 viewport heights of scrolling
      pin: true, // Lock the screen during transitions
      scrub: 0.5, // Tie animations smoothly to scroll velocity
      onUpdate: (self) => {
        const progress = self.progress; // Scroll progress (0 to 1)

        // Calculate active index (0 to 5)
        const rawIndex = Math.floor(progress * 5.99); // Maps progress securely to [0, 5]
        const activeIndex = Math.min(5, Math.max(0, rawIndex));

        // Only transition if the project index has actually changed
        if (activeIndex !== currentActiveIndex) {
          const prevIndex = currentActiveIndex;
          currentActiveIndex = activeIndex;

          // Transition Left Panel Details Cards
          gsap.to(detailCards[prevIndex], {
            opacity: 0,
            y: -30,
            duration: 0.35,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(detailCards[prevIndex], { display: "none" });
              gsap.set(detailCards[activeIndex], { display: "flex" });
              gsap.to(detailCards[activeIndex], {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out"
              });
            }
          });

          // Transition Right Panel Browser Mockup Screenshots
          gsap.to(mockupImages[prevIndex], {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut"
          });
          gsap.to(mockupImages[activeIndex], {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          });

          // Smoothly update the browser URL bar text
          urlText.textContent = projectUrls[activeIndex];
        }

        // Update indicator progress dots based on current scroll position
        const indicators = document.querySelectorAll(".indicator");
        const totalIndicators = indicators.length;
        const progressPerIndicator = 1 / totalIndicators;
        indicators.forEach((indicator, index) => {
          const indicatorStart = index * progressPerIndicator;
          const indicatorOpacity = progress > indicatorStart ? 1 : 0.2;
          gsap.to(indicator, {
            opacity: indicatorOpacity,
            duration: 0.1
          });
        });
      }
    });
  };

  // Run animations on page load
  initAnimations();

  // Re-run animations on window resize to recalculate coordinates and responsive behaviors
  window.addEventListener("resize", () => {
    initAnimations();
  });
});
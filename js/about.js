// about.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the about page or has about-hero section; exit if not
  const isAboutPage = document.querySelector(".page.about-page") || document.querySelector(".about-hero");
  if (!isAboutPage) return;

  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = []; // Store ScrollTrigger instances for cleanup

  // Initialize animations
  const initAnimations = () => {
    // Clean up existing ScrollTrigger instances
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    // Stats items animation (if stats elements exist)
    const statsElements = document.querySelectorAll(".stats-item-1, .stats-item-2, .stats-item-3");
    if (statsElements.length > 0) {
      // Set initial state for stats items
      gsap.set([".stats-item-1", ".stats-item-2", ".stats-item-3"], {
        scale: 0, // Start scaled down
      });

      // Animate stats items
      const statsAnimation = gsap.to(
        [".stats-item-1", ".stats-item-2", ".stats-item-3"],
        {
          scale: 1, // Scale to full size
          duration: 1, // Animation duration
          stagger: 0.1, // Stagger animations by 0.1s
          ease: "power4.out", // Smooth easing
          scrollTrigger: {
            trigger: ".stats", // Trigger element
            start: "top 50%", // Start when top of stats hits 50% of viewport
            toggleActions: "play none none none", // Play animation on enter
          },
        }
      );
      scrollTriggerInstances.push(statsAnimation.scrollTrigger); // Store instance
    }

    // Animations for larger screens (> 1000px)
    if (window.innerWidth > 1000) {
      // Tag animations (if elements exist)
      const tag1 = document.querySelector("#tag-1");
      if (tag1) {
        const tag1Animation = gsap.to("#tag-1", {
          y: -300, // Move up by 300px
          rotation: -45, // Rotate -45 degrees
          scrollTrigger: {
            trigger: ".about-copy", // Trigger element
            start: "top bottom", // Start when top of about-copy hits bottom of viewport
            end: "bottom+=100% top", // End after scrolling 100% beyond bottom
            scrub: 1, // Tie animation to scroll position
          },
        });
        scrollTriggerInstances.push(tag1Animation.scrollTrigger); // Store instance
      }

      const tag2 = document.querySelector("#tag-2");
      if (tag2) {
        const tag2Animation = gsap.to("#tag-2", {
          y: -150, // Move up by 150px
          rotation: 70, // Rotate 70 degrees
          scrollTrigger: {
            trigger: ".about-copy", // Trigger element
            start: "top bottom", // Start when top of about-copy hits bottom of viewport
            end: "bottom+=100% top", // End after scrolling 100% beyond bottom
            scrub: 1, // Tie animation to scroll position
          },
        });
        scrollTriggerInstances.push(tag2Animation.scrollTrigger); // Store instance
      }

      const tag3 = document.querySelector("#tag-3");
      if (tag3) {
        const tag3Animation = gsap.to("#tag-3", {
          y: -400, // Move up by 400px
          rotation: 120, // Rotate 120 degrees
          scrollTrigger: {
            trigger: ".about-copy", // Trigger element
            start: "top bottom", // Start when top of about-copy hits bottom of viewport
            end: "bottom+=100% top", // End after scrolling 100% beyond bottom
            scrub: 1, // Tie animation to scroll position
          },
        });
        scrollTriggerInstances.push(tag3Animation.scrollTrigger); // Store instance
      }

      const tag4 = document.querySelector("#tag-4");
      if (tag4) {
        const tag4Animation = gsap.to("#tag-4", {
          y: -350, // Move up by 350px
          rotation: -60, // Rotate -60 degrees
          scrollTrigger: {
            trigger: ".about-copy", // Trigger element
            start: "top bottom", // Start when top of about-copy hits bottom of viewport
            end: "bottom+=100% top", // End after scrolling 100% beyond bottom
            scrub: 1, // Tie animation to scroll position
          },
        });
        scrollTriggerInstances.push(tag4Animation.scrollTrigger); // Store instance
      }

      const tag5 = document.querySelector("#tag-5");
      if (tag5) {
        const tag5Animation = gsap.to("#tag-5", {
          y: -200, // Move up by 200px
          rotation: 100, // Rotate 100 degrees
          scrollTrigger: {
            trigger: ".about-copy", // Trigger element
            start: "top bottom", // Start when top of about-copy hits bottom of viewport
            end: "bottom+=100% top", // End after scrolling 100% beyond bottom
            scrub: 1, // Tie animation to scroll position
          },
        });
        scrollTriggerInstances.push(tag5Animation.scrollTrigger); // Store instance
      }
    }
  };

  // Live Compiling Terminal Animation
  const initTerminal = () => {
    const codeBody = document.querySelector(".terminal-code-body");
    if (!codeBody) return;

    // Define the compiler terminal output lines
    const terminalLines = [
      { text: "✦ Guraka Kalyan // Full Stack Engine v1.0.0", class: "term-head" },
      { text: "[INFO] Connecting to MongoDB Atlas... [CONNECTED]", class: "term-info", successWord: "[CONNECTED]" },
      { text: "[INFO] Handshake with Resend API... [SUCCESS]", class: "term-info", successWord: "[SUCCESS]" },
      { text: "[ROUTE] GET /api/featured-projects... [200 OK]", class: "term-route", successWord: "[200 OK]" },
      { text: "[ROUTE] POST /api/leads... [201 CREATED]", class: "term-route", successWord: "[201 CREATED]" },
      { text: "[ROUTE] GET /api/inventory... [200 OK]", class: "term-route", successWord: "[200 OK]" },
      { text: "[SYS] 6 projects deployed. All systems running.", class: "term-sys" },
      { text: "[SYS] Stack: MERN | Python | Java | REST APIs", class: "term-sys" },
      { text: "[SYS] Ready to Build / Ship / Scale / Repeat. ", class: "term-sys" }
    ];

    let currentLine = 0;
    let timer = null;

    const startTyping = () => {
      codeBody.innerHTML = "";
      currentLine = 0;
      typeNextLine();
    };

    const typeNextLine = () => {
      if (currentLine >= terminalLines.length) {
        // When typing completes, make the cursor blink infinitely for 4 seconds, then restart loop
        const activeCursor = codeBody.querySelector(".terminal-cursor");
        if (activeCursor) {
          activeCursor.classList.add("blink");
        }
        timer = setTimeout(() => {
          startTyping();
        }, 4000);
        return;
      }

      const lineData = terminalLines[currentLine];
      const lineEl = document.createElement("div");
      lineEl.className = "terminal-line " + (lineData.class || "");
      codeBody.appendChild(lineEl);

      const textSpan = document.createElement("span");
      lineEl.appendChild(textSpan);

      const cursorSpan = document.createElement("span");
      cursorSpan.className = "terminal-cursor";
      cursorSpan.textContent = "▌";
      lineEl.appendChild(cursorSpan);

      let charIndex = 0;
      const fullText = lineData.text;

      const typeChar = () => {
        if (charIndex < fullText.length) {
          // Detect and color code our glowing success badges
          if (lineData.successWord && fullText.substring(charIndex).startsWith(lineData.successWord)) {
            const successSpan = document.createElement("span");
            successSpan.className = "term-success";
            successSpan.textContent = lineData.successWord;
            textSpan.appendChild(successSpan);
            charIndex += lineData.successWord.length;
          } else {
            textSpan.appendChild(document.createTextNode(fullText[charIndex]));
            charIndex++;
          }

          // Dynamic randomized organic typing delay
          const delay = Math.random() * 8 + 12;
          timer = setTimeout(typeChar, delay);
        } else {
          // Finished typing line, remove transient typing cursor (the last line keeps it for loop wait)
          if (currentLine < terminalLines.length - 1) {
            cursorSpan.remove();
          }
          currentLine++;
          // Delay before next line triggers compile print
          timer = setTimeout(typeNextLine, 450);
        }
      };

      typeChar();
    };

    startTyping();

    return () => {
      clearTimeout(timer);
    };
  };

  // Run animations on page load
  initAnimations();
  const cleanTerminal = initTerminal();

  // Re-run animations only when viewport width changes to avoid mobile address bar height triggers
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      initAnimations();
    }
  });
});
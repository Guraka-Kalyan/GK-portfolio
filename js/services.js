// services.js

import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  const container = document.querySelector(".services-slider-container");
  const drawers = document.querySelectorAll(".service-drawer");
  if (!container || drawers.length === 0) return;

  let isMobile = window.innerWidth <= 1000;

  // Initialize drawers layout spacing / expanded state based on screen size
  const setupDrawers = () => {
    isMobile = window.innerWidth <= 1000;
    
    // Kill existing active tweens to prevent overlaps
    gsap.killTweensOf(drawers);
    
    if (!isMobile) {
      // Desktop: Reset to default equal width / flex-grow state
      drawers.forEach((drawer) => {
        drawer.classList.remove("is-expanded");
        gsap.set(drawer, { flexGrow: 1, width: "25%", height: "100%" });
        
        const expanded = drawer.querySelector(".drawer-expanded-content");
        const collapsed = drawer.querySelector(".drawer-collapsed-content");
        const glow = drawer.querySelector(".drawer-bg-glow");
        
        gsap.set(expanded, { opacity: 0, y: 20, pointerEvents: "none" });
        gsap.set(collapsed, { opacity: 1, y: 0 });
        gsap.set(glow, { opacity: 0 });
      });
    } else {
      // Mobile accordion: default expand the first drawer, collapse the others
      drawers.forEach((drawer, index) => {
        const expanded = drawer.querySelector(".drawer-expanded-content");
        const collapsed = drawer.querySelector(".drawer-collapsed-content");
        const glow = drawer.querySelector(".drawer-bg-glow");

        if (index === 0) {
          drawer.classList.add("is-expanded");
          gsap.set(drawer, { height: "auto", flexGrow: 0, width: "100%" });
          gsap.set(expanded, { opacity: 1, y: 0, height: "auto", pointerEvents: "auto" });
          gsap.set(glow, { opacity: 1 });
        } else {
          drawer.classList.remove("is-expanded");
          gsap.set(drawer, { height: "60px", flexGrow: 0, width: "100%" });
          gsap.set(expanded, { opacity: 0, y: 20, height: 0, pointerEvents: "none" });
          gsap.set(glow, { opacity: 0 });
        }
        
        // Hide collapsed vertical text on mobile, header is handled by mobile-header
        gsap.set(collapsed, { opacity: 0 });
      });
    }
  };

  // DESKTOP: Hover handlers for vertical drawers flex-grow transitions
  drawers.forEach((drawer, index) => {
    drawer.addEventListener("mouseenter", () => {
      if (isMobile) return;
      
      drawers.forEach((d, i) => {
        const expanded = d.querySelector(".drawer-expanded-content");
        const collapsed = d.querySelector(".drawer-collapsed-content");
        const glow = d.querySelector(".drawer-bg-glow");
        
        gsap.killTweensOf([d, expanded, collapsed, glow]);
        
        if (i === index) {
          d.classList.add("is-expanded");
          // Hovered drawer expands to ~60% width using flex-grow
          gsap.to(d, { flexGrow: 4.5, duration: 0.55, ease: "power3.out" });
          gsap.to(expanded, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, pointerEvents: "auto", ease: "power2.out" });
          gsap.to(collapsed, { opacity: 0, y: -25, duration: 0.3, ease: "power2.in" });
          gsap.to(glow, { opacity: 1, duration: 0.55 });
        } else {
          d.classList.remove("is-expanded");
          // Other drawers compress to ~13.3% width
          gsap.to(d, { flexGrow: 1, duration: 0.55, ease: "power3.out" });
          gsap.to(expanded, { opacity: 0, y: 20, duration: 0.3, pointerEvents: "none", ease: "power2.in" });
          gsap.to(collapsed, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power2.out" });
          gsap.to(glow, { opacity: 0, duration: 0.4 });
        }
      });
    });
  });

  // DESKTOP: Reset drawers to equal widths on container mouseleave
  container.addEventListener("mouseleave", () => {
    if (isMobile) return;
    
    drawers.forEach((d) => {
      const expanded = d.querySelector(".drawer-expanded-content");
      const collapsed = d.querySelector(".drawer-collapsed-content");
      const glow = d.querySelector(".drawer-bg-glow");
      
      gsap.killTweensOf([d, expanded, collapsed, glow]);
      d.classList.remove("is-expanded");
      
      gsap.to(d, { flexGrow: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(expanded, { opacity: 0, y: 20, duration: 0.3, pointerEvents: "none", ease: "power2.out" });
      gsap.to(collapsed, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      gsap.to(glow, { opacity: 0, duration: 0.4 });
    });
  });

  // MOBILE: Click event accordion toggling
  drawers.forEach((drawer, index) => {
    // Add event listener to mobile header and drawer itself
    const mobileHeader = drawer.querySelector(".drawer-mobile-header");
    const triggerElement = mobileHeader || drawer;

    triggerElement.addEventListener("click", (e) => {
      if (!isMobile) return;
      if (drawer.classList.contains("is-expanded")) return; // skip if already expanded

      // Stop propagation to prevent multiple triggers if children clicked
      e.stopPropagation();

      drawers.forEach((d, i) => {
        const expanded = d.querySelector(".drawer-expanded-content");
        const glow = d.querySelector(".drawer-bg-glow");

        gsap.killTweensOf([d, expanded, glow]);

        if (i === index) {
          d.classList.add("is-expanded");
          // Expand height to natural auto
          gsap.to(d, { height: "auto", duration: 0.5, ease: "power2.out" });
          gsap.to(expanded, { opacity: 1, y: 0, height: "auto", duration: 0.5, pointerEvents: "auto", ease: "power2.out" });
          gsap.to(glow, { opacity: 1, duration: 0.5 });
        } else {
          d.classList.remove("is-expanded");
          // Collapse others back to 60px header only
          gsap.to(d, { height: "60px", duration: 0.5, ease: "power2.out" });
          gsap.to(expanded, { opacity: 0, y: 20, height: 0, duration: 0.4, pointerEvents: "none", ease: "power2.out" });
          gsap.to(glow, { opacity: 0, duration: 0.4 });
        }
      });
    });
  });

  // Initial setup and responsive listener
  setupDrawers();
  window.addEventListener("resize", setupDrawers);
});
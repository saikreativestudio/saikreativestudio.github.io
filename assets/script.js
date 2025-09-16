// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("nav-blur");
  } else {
    navbar.classList.remove("nav-blur");
  }
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all animation elements
document
  .querySelectorAll(".fade-in-up, .slide-in-left, .slide-in-right, .scale-in")
  .forEach((el) => {
    observer.observe(el);
  });

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const increment = target / 100;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (target === 100 ? "%" : "+");
  }, 20);
}

// Counter observer
const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      animateCounter(counter);
      counterObserver.unobserve(counter);
    }
  });
}, observerOptions);

// Observe counter elements
document.querySelectorAll(".counter").forEach((counter) => {
  counterObserver.observe(counter);
});

// Enhanced Testimonial Slider Class
class TestimonialSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".testimonial-slide");
    this.dots = document.querySelectorAll(".testimonial-dot");
    this.totalSlides = this.slides.length;
    this.autoSlideInterval = null;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    this.setupSlider();
    this.bindEvents();
    this.startAutoSlide();
  }

  setupSlider() {
    // Setup slider container
    const container = document.querySelector(".testimonial-container");
    if (container) {
      container.style.position = "relative";
      container.style.minHeight = "500px";
      container.style.overflow = "hidden";
    }

    // Hide all slides initially and position them
    this.slides.forEach((slide, index) => {
      slide.style.position = "absolute";
      slide.style.top = "0";
      slide.style.left = "0";
      slide.style.width = "100%";
      slide.style.opacity = index === 0 ? "1" : "0";
      slide.style.transform =
        index === 0 ? "translateX(0)" : "translateX(100%)";
      slide.style.transition =
        "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      slide.classList.remove("active");
      if (index === 0) slide.classList.add("active");
    });

    this.updateDots();
  }

  showSlide(index, direction = "next") {
    if (this.isTransitioning || index === this.currentSlide) return;

    this.isTransitioning = true;
    const currentSlide = this.slides[this.currentSlide];
    const nextSlide = this.slides[index];

    // Prepare next slide position
    nextSlide.style.transform =
      direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    nextSlide.style.opacity = "0";

    // Animate out current slide
    currentSlide.style.opacity = "0";
    currentSlide.style.transform =
      direction === "next" ? "translateX(-50%)" : "translateX(50%)";
    currentSlide.classList.remove("active");

    // Animate in next slide
    setTimeout(() => {
      nextSlide.style.opacity = "1";
      nextSlide.style.transform = "translateX(0)";
      nextSlide.classList.add("active");

      // Reset current slide position after animation
      setTimeout(() => {
        currentSlide.style.transform =
          direction === "next" ? "translateX(-100%)" : "translateX(100%)";
        this.isTransitioning = false;
      }, 800);
    }, 100);

    this.currentSlide = index;
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.style.transition = "all 0.3s ease";
      if (index === this.currentSlide) {
        dot.classList.remove("bg-gray-500");
        dot.classList.add("bg-orange-500");
        dot.style.transform = "scale(1.3)";
        dot.style.boxShadow = "0 0 10px rgba(255, 107, 53, 0.5)";
      } else {
        dot.classList.remove("bg-orange-500");
        dot.classList.add("bg-gray-500");
        dot.style.transform = "scale(1)";
        dot.style.boxShadow = "none";
      }
    });
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(nextIndex, "next");
  }

  prevSlide() {
    const prevIndex =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(prevIndex, "prev");
  }

  goToSlide(index) {
    if (index !== this.currentSlide && !this.isTransitioning) {
      const direction = index > this.currentSlide ? "next" : "prev";
      this.showSlide(index, direction);
    }
  }

  bindEvents() {
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.stopAutoSlide();
        this.goToSlide(index);
        this.startAutoSlide();
      });

      // Add hover effect
      dot.addEventListener("mouseenter", () => {
        if (index !== this.currentSlide) {
          dot.style.transform = "scale(1.1)";
        }
      });

      dot.addEventListener("mouseleave", () => {
        if (index !== this.currentSlide) {
          dot.style.transform = "scale(1)";
        }
      });
    });

    // Touch/swipe support for mobile
    let startX = null;
    let startY = null;
    const slider = document.querySelector(".testimonial-container");

    if (slider) {
      slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });

      slider.addEventListener("touchend", (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          this.stopAutoSlide();
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
          this.startAutoSlide();
        }

        startX = null;
        startY = null;
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (this.isInViewport(slider)) {
          if (e.key === "ArrowLeft") {
            this.stopAutoSlide();
            this.prevSlide();
            this.startAutoSlide();
          } else if (e.key === "ArrowRight") {
            this.stopAutoSlide();
            this.nextSlide();
            this.startAutoSlide();
          }
        }
      });

      // Pause on hover
      slider.addEventListener("mouseenter", () => {
        this.stopAutoSlide();
      });

      slider.addEventListener("mouseleave", () => {
        this.startAutoSlide();
      });
    }
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  destroy() {
    this.stopAutoSlide();
  }
}

// Floating particles animation
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 4 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Enhanced Form submission
function setupFormSubmission() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Add loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-75", "cursor-not-allowed");

    // Get form data for validation
    const formData = new FormData(this);
    const firstName =
      formData.get("firstName") ||
      this.querySelector('input[placeholder="John"]')?.value;
    const email =
      formData.get("email") || this.querySelector('input[type="email"]')?.value;

    // Basic validation
    if (!firstName || !email) {
      showMessage("Please fill in all required fields.", "error");
      resetSubmitButton(submitBtn, originalText);
      return;
    }

    // Simulate form processing
    setTimeout(() => {
      showMessage(
        "Thank you! Your message has been sent successfully.",
        "success"
      );

      // Reset form and button
      this.reset();
      resetSubmitButton(submitBtn, originalText);
    }, 2000);
  });

  function showMessage(text, type) {
    const existingMsg = form.querySelector(".form-message");
    if (existingMsg) existingMsg.remove();

    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message p-4 rounded-xl mb-6 text-center transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    messageDiv.textContent = text;

    form.insertBefore(messageDiv, form.firstChild);

    // Animate in
    setTimeout(() => {
      messageDiv.style.opacity = "1";
      messageDiv.style.transform = "translateY(0)";
    }, 100);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.style.opacity = "0";
      messageDiv.style.transform = "translateY(-20px)";
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }

  function resetSubmitButton(btn, originalText) {
    btn.textContent = originalText;
    btn.disabled = false;
    btn.classList.remove("opacity-75", "cursor-not-allowed");
  }
}

// Enhanced Portfolio item hover effects
function setupPortfolioHovers() {
  document.querySelectorAll(".portfolio-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-12px) scale(1.02)";
      this.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.2)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "";
    });

    // Add click functionality for portfolio items
    item.addEventListener("click", function () {
      const title = this.querySelector("h3").textContent;
      showPortfolioModal(title);
    });
  });
}

// Portfolio Modal (optional enhancement)
function showPortfolioModal(title) {
  // Create modal backdrop
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-2xl mx-4 transform scale-95 transition-transform duration-300">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-3xl font-bold text-gray-800">${title}</h3>
        <button class="text-gray-500 hover:text-gray-700 text-3xl" onclick="this.closest('.fixed').remove()">&times;</button>
      </div>
      <p class="text-gray-600 mb-6">This is a detailed view of the ${title} project. Here you would typically show more images, project details, client testimonials, etc.</p>
      <div class="flex justify-end space-x-4">
        <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors">Close</button>
        <button class="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">View Full Project</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => {
    modal.style.opacity = "1";
    modal.querySelector("div").style.transform = "scale(1)";
  }, 100);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Enhanced Service cards hover effects
function setupServiceHovers() {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".service-icon");
      if (icon) {
        icon.style.transform = "scale(1.15) rotate(5deg)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".service-icon");
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)";
      }
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize particles
  createParticles();

  // Initialize testimonial slider
  window.testimonialSlider = new TestimonialSlider();

  // Setup all interactive elements
  setupFormSubmission();
  setupPortfolioHovers();
  setupServiceHovers();

  // Initialize typing effect
  setupTypingEffect();

  // Add page loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "1";
  }, 100);

  // Add smooth reveal animations on scroll
  const revealElements = document.querySelectorAll(
    ".hover-lift, .scale-in, .fade-in-up"
  );
  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.testimonialSlider) {
    window.testimonialSlider.setupSlider();
  }
});

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (window.testimonialSlider) {
    window.testimonialSlider.destroy();
  }
});

document.getElementById("menu-btn").addEventListener("click", function () {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});

function setupAlternatingTypingEffect() {
  const typingText = document.getElementById("typing-text");
  if (!typingText) return;

  const texts = ["Graphic Designer", "Digital Marketer"];
  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typeSpeed = 150;
  let deleteSpeed = 75;
  let pauseDuration = 2000;

  function typeWriter() {
    const currentText = texts[currentTextIndex];

    if (!isDeleting) {
      // Typing
      typingText.textContent = currentText.substring(0, currentCharIndex + 1);
      currentCharIndex++;

      if (currentCharIndex === currentText.length) {
        // Finished typing, pause then start deleting
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, pauseDuration);
        return;
      }

      setTimeout(typeWriter, typeSpeed);
    } else {
      // Deleting
      typingText.textContent = currentText.substring(0, currentCharIndex - 1);
      currentCharIndex--;

      if (currentCharIndex === 0) {
        // Finished deleting, move to next text
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        setTimeout(typeWriter, 500);
        return;
      }

      setTimeout(typeWriter, deleteSpeed);
    }
  }

  // Start the typing effect after a delay
  setTimeout(() => {
    typingText.style.borderRight = "2px solid #ff6b35";

    // Blinking cursor animation
    setInterval(() => {
      typingText.style.borderColor =
        typingText.style.borderColor === "transparent"
          ? "#ff6b35"
          : "transparent";
    }, 500);

    typeWriter();
  }, 1500);
}

// Enhanced Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      const isHidden = mobileMenu.classList.contains("hidden");

      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        // Add slide down animation
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.opacity = "0";
        setTimeout(() => {
          mobileMenu.style.transition =
            "max-height 0.3s ease, opacity 0.3s ease";
          mobileMenu.style.maxHeight = "400px";
          mobileMenu.style.opacity = "1";
        }, 10);
      } else {
        mobileMenu.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.opacity = "0";
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.opacity = "0";
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !menuBtn.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        if (!mobileMenu.classList.contains("hidden")) {
          mobileMenu.style.transition =
            "max-height 0.3s ease, opacity 0.3s ease";
          mobileMenu.style.maxHeight = "0";
          mobileMenu.style.opacity = "0";
          setTimeout(() => {
            mobileMenu.classList.add("hidden");
          }, 300);
        }
      }
    });
  }

  // Initialize the alternating typing effect
  setupAlternatingTypingEffect();
});

document.getElementById("contactBtn").addEventListener("click", function () {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("portfolioBtn").addEventListener("click", function () {
  document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" });
});

class MobileNavigation {
  constructor() {
    this.menuBtn = document.getElementById("menu-btn");
    this.mobileMenu = document.getElementById("mobile-menu");
    this.navbar = document.getElementById("navbar");
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
    this.setupSmoothScrolling();
  }

  bindEvents() {
    // Menu toggle
    this.menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu when clicking on links
    const mobileLinks = this.mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        !this.menuBtn.contains(e.target) &&
        !this.mobileMenu.contains(e.target)
      ) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Handle scroll for navbar background
    window.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.mobileMenu.classList.add("show");
    this.menuBtn.classList.add("active");
    this.isMenuOpen = true;
    document.body.style.overflow = "hidden"; // Prevent body scroll

    // Add ARIA attributes for accessibility
    this.menuBtn.setAttribute("aria-expanded", "true");
    this.mobileMenu.setAttribute("aria-hidden", "false");
  }

  closeMenu() {
    this.mobileMenu.classList.remove("show");
    this.menuBtn.classList.remove("active");
    this.isMenuOpen = false;
    document.body.style.overflow = ""; // Restore body scroll

    // Update ARIA attributes
    this.menuBtn.setAttribute("aria-expanded", "false");
    this.mobileMenu.setAttribute("aria-hidden", "true");
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add("navbar-scrolled");
    } else {
      this.navbar.classList.remove("navbar-scrolled");
    }
  }

  setupSmoothScrolling() {
    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));

        if (target) {
          // Close mobile menu if open
          if (this.isMenuOpen) {
            this.closeMenu();
          }

          // Calculate offset for fixed navbar
          const navbarHeight = this.navbar.offsetHeight;
          const targetPosition = target.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

// Active Navigation Link Highlighter
class NavHighlighter {
  constructor() {
    this.navLinks = document.querySelectorAll(".nav-link, .mobile-menu-item");
    this.sections = document.querySelectorAll("section[id]");
    this.init();
  }

  init() {
    this.highlightActiveSection();
    window.addEventListener("scroll", () => {
      this.highlightActiveSection();
    });
  }

  highlightActiveSection() {
    const scrollPosition = window.scrollY + 100;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        this.updateActiveLink(sectionId);
      }
    });
  }

  updateActiveLink(activeId) {
    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${activeId}`) {
        link.classList.add("text-orange-400");
        link.classList.remove("text-white");
      } else {
        link.classList.remove("text-orange-400");
        link.classList.add("text-white");
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MobileNavigation();
  new NavHighlighter();

  // Add loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * FHIR Learning Platform - Application Logic
 *
 * This module handles all interactive functionality:
 * - Dynamic section rendering
 * - Scrollspy navigation
 * - JSON viewer expand/collapse
 * - Copy-to-clipboard
 * - Mobile navigation
 * - Progress tracking
 * - Toast notifications
 */

(function () {
  "use strict";

  // =========================================
  // APPLICATION STATE
  // =========================================
  const AppState = {
    activeSection: null,
    sectionsRendered: false,
    expandedJsonViewers: new Set(),
    scrollspyObserver: null,
    mobileMenuOpen: false,
  };

  // =========================================
  // DOM ELEMENTS
  // =========================================
  const DOM = {
    sectionsContainer: null,
    sidebar: null,
    sidebarOverlay: null,
    mobileMenuToggle: null,
    navLinks: null,
    progressFill: null,
    progressText: null,
    toastContainer: null,
  };

  // =========================================
  // INITIALIZATION
  // =========================================

  /**
   * Initialize the application when DOM is ready
   */
  function init() {
    // Cache DOM elements
    cacheDOMElements();

    // Render content sections
    renderSections();

    // Initialize features
    initScrollspy();
    initSmoothScroll();
    initMobileMenu();
    initJsonViewers();

    // Update progress on scroll
    window.addEventListener("scroll", throttle(updateProgress, 100));

    // Initial progress update
    updateProgress();

    console.log("🏥 FHIR Learning Platform initialized");
  }

  /**
   * Cache frequently accessed DOM elements
   */
  function cacheDOMElements() {
    DOM.sectionsContainer = document.getElementById("sections-container");
    DOM.sidebar = document.getElementById("sidebar");
    DOM.sidebarOverlay = document.getElementById("sidebar-overlay");
    DOM.mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    DOM.progressFill = document.getElementById("progress-fill");
    DOM.progressText = document.getElementById("progress-text");
    DOM.toastContainer = document.getElementById("toast-container");
  }

  // =========================================
  // SECTION RENDERING
  // =========================================

  /**
   * Render all content sections from FHIR data
   */
  function renderSections() {
    if (!DOM.sectionsContainer || !FHIRData || !FHIRData.sections) {
      console.error("Cannot render sections: missing container or data");
      return;
    }

    const fragment = document.createDocumentFragment();

    FHIRData.sections.forEach((section, index) => {
      const sectionElement = createSectionElement(section, index);
      fragment.appendChild(sectionElement);
    });

    DOM.sectionsContainer.appendChild(fragment);
    AppState.sectionsRendered = true;

    // Update nav links reference after rendering
    DOM.navLinks = document.querySelectorAll(".nav-link");
  }

  /**
   * Create a complete section element
   * @param {Object} section - Section data
   * @param {number} index - Section index
   * @returns {HTMLElement}
   */
  function createSectionElement(section, index) {
    const sectionEl = document.createElement("section");
    sectionEl.className = "content-section";
    sectionEl.id = section.id;
    sectionEl.setAttribute("aria-labelledby", `${section.id}-title`);
    sectionEl.style.animationDelay = `${0.1 + index * 0.05}s`;

    sectionEl.innerHTML = `
            <!-- Section Header -->
            <header class="section-header">
                <div class="section-icon" aria-hidden="true">${section.icon}</div>
                <div class="section-title-group">
                    <span class="section-step">Step ${section.stepNumber}</span>
                    <h2 class="section-title" id="${section.id}-title">${section.title}</h2>
                </div>
            </header>

            <!-- Clinical Story Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon story" aria-hidden="true">📖</div>
                    <h3 class="card-title">${section.story.title}</h3>
                </header>
                <div class="card-content">
                    ${section.story.content}
                </div>
            </article>

            <!-- Workflow Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon workflow" aria-hidden="true">⚙️</div>
                    <h3 class="card-title">${section.workflow.title}</h3>
                </header>
                <div class="card-content">
                    ${section.workflow.content}
                </div>
            </article>

            <!-- FHIR Explanation Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon fhir" aria-hidden="true">🔥</div>
                    <h3 class="card-title">${section.fhirExplanation.title}</h3>
                </header>
                <div class="card-content">
                    ${section.fhirExplanation.content}
                </div>
            </article>

            <!-- FHIR JSON Viewer -->
            ${createJsonViewer(section.fhirResource, section.id)}
        `;

    return sectionEl;
  }

  /**
   * Create a JSON viewer component
   * @param {Object} resource - FHIR resource object
   * @param {string} sectionId - Section identifier
   * @returns {string} HTML string
   */
  function createJsonViewer(resource, sectionId) {
    const viewerId = `json-viewer-${sectionId}`;
    const resourceType = resource.resourceType;
    const jsonString = JSON.stringify(resource, null, 2);

    return `
            <div class="json-viewer" id="${viewerId}" data-section="${sectionId}">
                <header class="json-viewer-header">
                    <div class="json-viewer-title">
                        <span class="json-btn-icon">{ }</span>
                        <span>FHIR Resource: </span>
                        <span class="resource-type">${resourceType}</span>
                    </div>
                    <div class="json-viewer-actions">
                        <button class="json-btn toggle-btn"
                                data-viewer="${viewerId}"
                                aria-expanded="true"
                                aria-controls="${viewerId}-content">
                            <span class="json-btn-icon">▼</span>
                            <span class="btn-text">Collapse</span>
                        </button>
                        <button class="json-btn fullscreen-btn"
                                data-json="${escapeHtmlAttr(jsonString)}"
                                data-resource-type="${resourceType}"
                                aria-label="View JSON in fullscreen">
                            <span class="json-btn-icon">⛶</span>
                            <span class="btn-text">Fullscreen</span>
                        </button>
                        <button class="json-btn copy-btn"
                                data-json="${escapeHtmlAttr(jsonString)}"
                                aria-label="Copy JSON to clipboard">
                            <span class="json-btn-icon">📋</span>
                            <span class="btn-text">Copy</span>
                        </button>
                    </div>
                </header>
                <div class="json-viewer-content" id="${viewerId}-content">
                    <pre><code class="json-code">${syntaxHighlightJson(jsonString)}</code></pre>
                </div>
            </div>
        `;
  }

  /**
   * Apply syntax highlighting to JSON string
   * @param {string} json - JSON string
   * @returns {string} HTML with syntax highlighting
   */
  function syntaxHighlightJson(json) {
    // Escape HTML first
    json = escapeHtml(json);

    // Apply syntax highlighting with regex
    return (
      json
        // Keys (property names)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        // String values
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        // Numbers
        .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
        // Booleans
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        // Null
        .replace(/: (null)/g, ': <span class="json-null">$1</span>')
        // Brackets
        .replace(/(\{|\}|\[|\])/g, '<span class="json-bracket">$1</span>')
    );
  }

  /**
   * Escape HTML special characters
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Escape string for use in HTML attributes (including quotes)
   * @param {string} str - Input string
   * @returns {string} Escaped string safe for HTML attributes
   */
  function escapeHtmlAttr(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // =========================================
  // SCROLLSPY NAVIGATION
  // =========================================

  /**
   * Initialize scrollspy using Intersection Observer
   */
  function initScrollspy() {
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    AppState.scrollspyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActiveNavLink(entry.target.id);
        }
      });
    }, options);

    // Observe all sections after they're rendered
    setTimeout(() => {
      document.querySelectorAll(".content-section").forEach((section) => {
        AppState.scrollspyObserver.observe(section);
      });
    }, 100);
  }

  /**
   * Update active navigation link
   * @param {string} sectionId - Active section ID
   */
  function updateActiveNavLink(sectionId) {
    if (AppState.activeSection === sectionId) return;

    AppState.activeSection = sectionId;

    if (!DOM.navLinks) {
      DOM.navLinks = document.querySelectorAll(".nav-link");
    }

    DOM.navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === sectionId) {
        link.classList.add("active");
        link.setAttribute("aria-current", "true");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // =========================================
  // SMOOTH SCROLLING
  // =========================================

  /**
   * Initialize smooth scroll for navigation links
   */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const navLink = e.target.closest(".nav-link");
      if (navLink) {
        e.preventDefault();
        const targetId = navLink.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Close mobile menu if open
          if (AppState.mobileMenuOpen) {
            closeMobileMenu();
          }

          // Smooth scroll to section
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update URL without triggering scroll
          history.pushState(null, "", `#${targetId}`);
        }
      }
    });
  }

  // =========================================
  // MOBILE MENU
  // =========================================

  /**
   * Initialize mobile menu toggle
   */
  function initMobileMenu() {
    if (!DOM.mobileMenuToggle) return;

    DOM.mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    if (DOM.sidebarOverlay) {
      DOM.sidebarOverlay.addEventListener("click", closeMobileMenu);
    }

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && AppState.mobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu state
   */
  function toggleMobileMenu() {
    if (AppState.mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    AppState.mobileMenuOpen = true;
    DOM.sidebar.classList.add("open");
    DOM.sidebarOverlay.classList.add("active");
    DOM.mobileMenuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    AppState.mobileMenuOpen = false;
    DOM.sidebar.classList.remove("open");
    DOM.sidebarOverlay.classList.remove("active");
    DOM.mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // =========================================
  // JSON VIEWER INTERACTIONS
  // =========================================

  /**
   * Initialize JSON viewer interactions
   */
  function initJsonViewers() {
    document.addEventListener("click", (e) => {
      // Toggle button
      const toggleBtn = e.target.closest(".toggle-btn");
      if (toggleBtn) {
        toggleJsonViewer(toggleBtn);
        return;
      }

      // Fullscreen button
      const fullscreenBtn = e.target.closest(".fullscreen-btn");
      if (fullscreenBtn) {
        openFullscreenJson(fullscreenBtn);
        return;
      }

      // Copy button
      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        copyJsonToClipboard(copyBtn);
        return;
      }

      // Close fullscreen modal
      const closeFullscreenBtn = e.target.closest(".fullscreen-close");
      if (closeFullscreenBtn) {
        closeFullscreenJson();
        return;
      }

      // Click on overlay to close
      if (e.target.classList.contains("fullscreen-modal")) {
        closeFullscreenJson();
        return;
      }
    });

    // ESC key to close fullscreen
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.querySelector(".fullscreen-modal.active");
        if (modal) {
          closeFullscreenJson();
        }
      }
    });
  }

  /**
   * Toggle JSON viewer expand/collapse
   * @param {HTMLElement} button - Toggle button element
   */
  function toggleJsonViewer(button) {
    const viewerId = button.getAttribute("data-viewer");
    const content = document.getElementById(`${viewerId}-content`);
    const icon = button.querySelector(".json-btn-icon");
    const text = button.querySelector(".btn-text");

    if (!content) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      // Collapse
      content.classList.add("collapsed");
      button.setAttribute("aria-expanded", "false");
      icon.textContent = "▶";
      text.textContent = "Expand";
      AppState.expandedJsonViewers.delete(viewerId);
    } else {
      // Expand
      content.classList.remove("collapsed");
      button.setAttribute("aria-expanded", "true");
      icon.textContent = "▼";
      text.textContent = "Collapse";
      AppState.expandedJsonViewers.add(viewerId);
    }
  }

  /**
   * Copy JSON to clipboard
   * @param {HTMLElement} button - Copy button element
   */
  async function copyJsonToClipboard(button) {
    const json = button.getAttribute("data-json");

    try {
      // Decode the escaped HTML
      const textarea = document.createElement("textarea");
      textarea.innerHTML = json;
      const decodedJson = textarea.value;

      await navigator.clipboard.writeText(decodedJson);

      // Visual feedback
      button.classList.add("copied");
      const text = button.querySelector(".btn-text");
      const originalText = text.textContent;
      text.textContent = "Copied!";

      // Show toast
      showToast("JSON copied to clipboard!", "success");

      // Reset button after delay
      setTimeout(() => {
        button.classList.remove("copied");
        text.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard", "error");
    }
  }

  /**
   * Open JSON in fullscreen modal
   * @param {HTMLElement} button - Fullscreen button element
   */
  function openFullscreenJson(button) {
    const json = button.getAttribute("data-json");
    const resourceType = button.getAttribute("data-resource-type");

    // Decode the escaped HTML
    const textarea = document.createElement("textarea");
    textarea.innerHTML = json;
    const decodedJson = textarea.value;

    // Create or get modal
    let modal = document.getElementById("fullscreen-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "fullscreen-modal";
      modal.className = "fullscreen-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "fullscreen-modal-title");
      document.body.appendChild(modal);
    }

    // Create modal content
    modal.innerHTML = `
            <div class="fullscreen-modal-content">
                <header class="fullscreen-modal-header">
                    <div class="fullscreen-modal-title" id="fullscreen-modal-title">
                        <span class="json-btn-icon">{ }</span>
                        <span>FHIR Resource: </span>
                        <span class="resource-type">${resourceType}</span>
                    </div>
                    <div class="fullscreen-modal-actions">
                        <button class="json-btn copy-btn-fullscreen"
                                data-json="${escapeHtmlAttr(json)}"
                                aria-label="Copy JSON to clipboard">
                            <span class="json-btn-icon">📋</span>
                            <span class="btn-text">Copy</span>
                        </button>
                        <button class="json-btn fullscreen-close"
                                aria-label="Close fullscreen view">
                            <span class="json-btn-icon">✕</span>
                            <span class="btn-text">Close</span>
                        </button>
                    </div>
                </header>
                <div class="fullscreen-modal-body">
                    <pre><code class="json-code">${syntaxHighlightJson(decodedJson)}</code></pre>
                </div>
            </div>
        `;

    // Add copy functionality to fullscreen copy button
    const copyBtn = modal.querySelector(".copy-btn-fullscreen");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(decodedJson);
        copyBtn.classList.add("copied");
        const text = copyBtn.querySelector(".btn-text");
        const originalText = text.textContent;
        text.textContent = "Copied!";
        showToast("JSON copied to clipboard!", "success");
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          text.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        showToast("Failed to copy to clipboard", "error");
      }
    });

    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus on close button for accessibility
    setTimeout(() => {
      modal.querySelector(".fullscreen-close").focus();
    }, 100);
  }

  /**
   * Close fullscreen JSON modal
   */
  function closeFullscreenJson() {
    const modal = document.getElementById("fullscreen-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";

      // Animation delay before cleanup
      setTimeout(() => {
        modal.innerHTML = "";
      }, 300);
    }
  }

  // =========================================
  // PROGRESS TRACKING
  // =========================================

  /**
   * Update progress indicator based on scroll position
   */
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));

    if (DOM.progressFill) {
      DOM.progressFill.style.width = `${progress}%`;
    }

    if (DOM.progressText) {
      DOM.progressText.textContent = `${progress}% Complete`;
    }
  }

  // =========================================
  // TOAST NOTIFICATIONS
  // =========================================

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, info)
   */
  function showToast(message, type = "info") {
    if (!DOM.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("role", "alert");

    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
    };

    toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

    DOM.toastContainer.appendChild(toast);

    // Auto-remove after delay
    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // =========================================
  // UTILITY FUNCTIONS
  // =========================================

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function}
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // =========================================
  // ACCESSIBILITY ENHANCEMENTS
  // =========================================

  /**
   * Handle keyboard navigation in sidebar
   */
  function initKeyboardNav() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.addEventListener("keydown", (e) => {
      const navLinks = Array.from(sidebar.querySelectorAll(".nav-link"));
      const currentIndex = navLinks.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % navLinks.length;
          navLinks[nextIndex].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
          navLinks[nextIndex].focus();
          break;
        case "Home":
          e.preventDefault();
          navLinks[0].focus();
          break;
        case "End":
          e.preventDefault();
          navLinks[navLinks.length - 1].focus();
          break;
      }
    });
  }

  // =========================================
  // ANIMATION ON SCROLL REVEAL
  // =========================================

  /**
   * Initialize scroll reveal animations for cards
   */
  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards after sections are rendered
    setTimeout(() => {
      document.querySelectorAll(".content-card").forEach((card) => {
        revealObserver.observe(card);
      });
    }, 200);
  }

  // =========================================
  // URL HASH HANDLING
  // =========================================

  /**
   * Handle initial URL hash for direct linking
   */
  function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    }
  }

  // =========================================
  // PUBLIC API
  // =========================================
  window.FHIRApp = {
    showToast,
    toggleJsonViewer,
    getActiveSection: () => AppState.activeSection,
    getSectionsRendered: () => AppState.sectionsRendered,
  };

  // =========================================
  // INITIALIZE ON DOM READY
  // =========================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      initKeyboardNav();
      initScrollReveal();
      handleInitialHash();
    });
  } else {
    init();
    initKeyboardNav();
    initScrollReveal();
    handleInitialHash();
  }
})();

// Add fadeOut keyframe animation dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(styleSheet);

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  var backToTopButtons = document.querySelectorAll(".floating-back-to-top");
  var scrollProgress = document.querySelector(".scroll-progress");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hero = document.querySelector(".hero");

  function revealOnScroll(elements) {
    var targets = Array.prototype.slice.call(elements);
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  function renderFounders() {
    var grid = document.getElementById("founder-grid");
    var founders = window.KAGE_FOUNDERS;
    if (!grid || !Array.isArray(founders) || founders.length !== 3) {
      console.error("Founder showcase requires exactly three entries in founders-config.js.");
      return;
    }

    founders.forEach(function (founder, index) {
      var card = document.createElement("article");
      card.className = "founder-card about-reveal";
      card.style.setProperty("--reveal-delay", (index * 110) + "ms");

      var portrait = document.createElement("button");
      portrait.type = "button";
      portrait.className = "founder-portrait";
      portrait.setAttribute("aria-expanded", "false");
      portrait.setAttribute("aria-controls", "founder-details-" + (index + 1));
      portrait.setAttribute("aria-label", "Show details for " + (founder.name || "Founder 0" + (index + 1)));
      var image = document.createElement("img");
      image.src = founder.image;
      image.alt = founder.alt || founder.name;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", function () {
        console.error("Unable to load founder portrait for " + founder.name + ": " + founder.image);
      }, { once: true });
      portrait.appendChild(image);

      var details = document.createElement("div");
      details.className = "founder-details";
      details.id = "founder-details-" + (index + 1);
      var number = document.createElement("span");
      number.className = "founder-number";
      number.textContent = "KAGE ORIGIN / 0" + (index + 1);
      var name = document.createElement("h4");
      name.textContent = founder.name || "Founder 0" + (index + 1);
      name.className = "founder-name";
      var role = document.createElement("p");
      role.className = "founder-role";
      role.textContent = founder.role || "Founding team";
      var biography = document.createElement("p");
      biography.className = "founder-biography";
      biography.textContent = founder.biography || "";

      var caption = document.createElement("div");
      caption.className = "founder-caption";
      caption.appendChild(name);

      details.append(number, role, biography);
      card.append(portrait, caption, details);
      grid.appendChild(card);

      function setDetailsOpen(isOpen) {
        card.classList.toggle("is-open", isOpen);
        portrait.setAttribute("aria-expanded", String(isOpen));
        portrait.setAttribute("aria-label", (isOpen ? "Hide details for " : "Show details for ") + name.textContent);
      }

      portrait.addEventListener("pointerenter", function (event) {
        if (event.pointerType !== "touch") setDetailsOpen(true);
      });
      card.addEventListener("pointerleave", function () {
        if (!portrait.matches(":focus-visible") && !window.matchMedia("(hover: none)").matches) {
          setDetailsOpen(false);
        }
      });
      portrait.addEventListener("focus", function () {
        if (portrait.matches(":focus-visible")) setDetailsOpen(true);
      });
      portrait.addEventListener("blur", function (event) {
        if (!card.contains(event.relatedTarget) && !card.matches(":hover")) {
          setDetailsOpen(false);
        }
      });
      portrait.addEventListener("click", function () {
        if (window.matchMedia("(hover: none)").matches) {
          var isOpen = !card.classList.contains("is-open");
          grid.querySelectorAll(".founder-card").forEach(function (otherCard) {
            otherCard.classList.remove("is-open");
            var otherButton = otherCard.querySelector(".founder-portrait");
            if (otherButton) {
              otherButton.setAttribute("aria-expanded", "false");
              otherButton.setAttribute("aria-label", "Show details for " + otherCard.querySelector("h4").textContent);
            }
          });
          setDetailsOpen(isOpen);
        }
      });
    });
  }

  renderFounders();
  var aboutRevealItems = document.querySelectorAll(".about-reveal");
  if (!reducedMotion.matches) document.documentElement.classList.add("js-reveal");
  revealOnScroll(aboutRevealItems);

  var cursorBubble = document.querySelector(".cursor-bubble");
  if (cursorBubble && window.matchMedia("(pointer: fine)").matches) {
    var cursorFrame = 0;
    var cursorX = 0;
    var cursorY = 0;
    var cursorTargetX = 0;
    var cursorTargetY = 0;
    document.body.classList.add("has-custom-cursor");

    function animateCursor() {
      cursorX += (cursorTargetX - cursorX) * 0.35;
      cursorY += (cursorTargetY - cursorY) * 0.35;
      cursorBubble.style.setProperty("--cursor-x", cursorX + "px");
      cursorBubble.style.setProperty("--cursor-y", cursorY + "px");
      if (Math.abs(cursorTargetX - cursorX) > 0.2 || Math.abs(cursorTargetY - cursorY) > 0.2) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      } else {
        cursorFrame = 0;
      }
    }

    document.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;
      cursorTargetX = event.clientX;
      cursorTargetY = event.clientY;
      if (!cursorBubble.classList.contains("is-visible")) {
        cursorX = cursorTargetX;
        cursorY = cursorTargetY;
        cursorBubble.style.setProperty("--cursor-x", cursorX + "px");
        cursorBubble.style.setProperty("--cursor-y", cursorY + "px");
      }
      cursorBubble.classList.add("is-visible");
      cursorBubble.classList.toggle("is-interactive", Boolean(event.target.closest("a, button, [role='button']")));
      if (reducedMotion.matches) {
        cursorX = cursorTargetX;
        cursorY = cursorTargetY;
        cursorBubble.style.setProperty("--cursor-x", cursorX + "px");
        cursorBubble.style.setProperty("--cursor-y", cursorY + "px");
      } else if (!cursorFrame) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      }
    });

    document.addEventListener("pointerdown", function () {
      cursorBubble.classList.add("is-pressed");
    });
    document.addEventListener("pointerup", function () {
      cursorBubble.classList.remove("is-pressed");
    });
    document.addEventListener("pointerleave", function (event) {
      if (event.target === document.documentElement) cursorBubble.classList.remove("is-visible", "is-interactive");
    });
  }

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    var showBackToTop = window.scrollY > 320;
    backToTopButtons.forEach(function (button) {
      button.hidden = !showBackToTop;
    });
    if (scrollProgress) {
      var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
      scrollProgress.style.transform = "scaleX(" + progress + ")";
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader, { passive: true });

  backToTopButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    });
  });

  menuToggle.addEventListener("click", function () {
    var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });

  if (hero) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        hero.classList.add("is-entering");
      });
    });
    window.setTimeout(function () {
      hero.classList.remove("is-entering");
    }, 2800);
  }

  if (hero && window.matchMedia("(pointer: fine)").matches) {
    var heroScene = hero.querySelector(".hero-scene");
    hero.addEventListener("pointermove", function (event) {
      var bounds = heroScene.getBoundingClientRect();
      var x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      var y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      heroScene.style.setProperty("--scene-x", (-x * 42).toFixed(1) + "px");
      heroScene.style.setProperty("--scene-y", (-y * 30).toFixed(1) + "px");
      heroScene.style.setProperty("--scene-rotate-y", (x * 10).toFixed(2) + "deg");
      heroScene.style.setProperty("--scene-rotate-x", (-y * 7).toFixed(2) + "deg");
      heroScene.style.setProperty("--orbit-x", (x * 45).toFixed(1) + "px");
      heroScene.style.setProperty("--orbit-y", (y * 32).toFixed(1) + "px");
      heroScene.style.setProperty("--glint-x", (x * 62).toFixed(1) + "px");
      heroScene.style.setProperty("--glint-y", (y * 44).toFixed(1) + "px");
    });
    hero.addEventListener("pointerleave", function () {
      heroScene.style.removeProperty("--scene-x");
      heroScene.style.removeProperty("--scene-y");
      heroScene.style.removeProperty("--scene-rotate-x");
      heroScene.style.removeProperty("--scene-rotate-y");
      heroScene.style.removeProperty("--orbit-x");
      heroScene.style.removeProperty("--orbit-y");
    });
  }

  function startLogoOrbits() {
    var canvas = hero && hero.querySelector(".hero-orbit-canvas");
    var image = hero && hero.querySelector(".hero-scene-image");
    var context = canvas && canvas.getContext("2d", { alpha: true });
    if (!canvas || !image) return;
    if (!context) {
      console.error("Unable to create the transparent KAGE ORIGIN orbital canvas.");
      return;
    }

    var width = 0;
    var height = 0;
    var scale = 1;
    var frame = 0;
    var elapsed = 0;
    var lastTime = 0;
    var isVisible = true;
    var pointerX = 0;
    var pointerY = 0;
    var targetPointerX = 0;
    var targetPointerY = 0;
    var reduced = reducedMotion.matches;
    var orbiters = [
      { angle: 0.3, speed: 0.22, radiusX: 0.32, radiusY: 0.23, depth: 0.22, size: 17, color: "gold", phase: 0.4 },
      { angle: 2.15, speed: -0.17, radiusX: 0.38, radiusY: 0.27, depth: 0.31, size: 14, color: "blue", phase: 1.4 },
      { angle: 4.5, speed: 0.13, radiusX: 0.28, radiusY: 0.31, depth: 0.25, size: 11, color: "gold", phase: 2.1 },
      { angle: 1.8, speed: 0.19, radiusX: 0.42, radiusY: 0.19, depth: 0.18, size: 12, color: "blue", phase: 2.8 },
      { angle: 3.8, speed: -0.11, radiusX: 0.34, radiusY: 0.29, depth: 0.28, size: 9, color: "gold", phase: 4.2 }
    ];
    var trails = [
      { rx: 0.32, ry: 0.24, depth: 0.22, tilt: -0.16, color: "gold", alpha: 0.48 },
      { rx: 0.39, ry: 0.28, depth: 0.3, tilt: 0.12, color: "blue", alpha: 0.38 },
      { rx: 0.43, ry: 0.18, depth: 0.17, tilt: 0.22, color: "gold", alpha: 0.24 }
    ];

    function resizeCanvas() {
      var bounds = heroScene.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      drawFrame();
    }

    function logoCenter() {
      var naturalWidth = image.naturalWidth || 922;
      var naturalHeight = image.naturalHeight || 768;
      var coverScale = Math.max(width / naturalWidth, height / naturalHeight);
      var renderedWidth = naturalWidth * coverScale;
      var renderedHeight = naturalHeight * coverScale;
      return {
        x: (width - renderedWidth) / 2 + renderedWidth * 0.52,
        y: (height - renderedHeight) / 2 + renderedHeight * 0.48
      };
    }

    function orbitPoint(center, orbit, angle) {
      var rx = Math.min(width * orbit.rx, 520);
      var ry = Math.min(height * orbit.ry, 300);
      var depth = Math.min(width, height) * orbit.depth;
      var sine = Math.sin(angle);
      return {
        x: center.x + Math.cos(angle) * rx + pointerX * 9,
        y: center.y + sine * ry + sine * depth * orbit.tilt + pointerY * 7,
        z: Math.sin(angle + orbit.phase) * depth
      };
    }

    function drawTrail(center, trail) {
      var color = trail.color === "gold" ? "245,174,34" : "8,121,201";
      var front = [];
      var back = [];
      for (var i = 0; i <= 120; i += 1) {
        var angle = (i / 120) * Math.PI * 2;
        var point = orbitPoint(center, trail, angle);
        (point.z < 0 ? back : front).push(point);
      }

      function strokePath(points, alpha, blur, lineWidth) {
        if (points.length < 2) return;
        context.beginPath();
        points.forEach(function (point, index) {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.strokeStyle = "rgba(" + color + "," + alpha + ")";
        context.lineWidth = lineWidth;
        context.shadowColor = "rgba(" + color + "," + (alpha * 0.9) + ")";
        context.shadowBlur = blur;
        context.stroke();
      }

      context.save();
      context.beginPath();
      context.rect(0, 0, width, height);
      context.ellipse(center.x, center.y, Math.min(width * 0.25, 230), Math.min(height * 0.29, 220), -0.08, 0, Math.PI * 2);
      context.clip("evenodd");
      strokePath(back, trail.alpha * 0.58, 8, 1);
      strokePath(back, trail.alpha, 2, 0.7);
      context.restore();
      strokePath(front, trail.alpha * 0.42, 7, 1);
      strokePath(front, trail.alpha, 2, 0.8);
      context.shadowBlur = 0;
    }

    function drawSphere(point, orb) {
      var perspective = Math.max(0.68, Math.min(1.24, 0.96 + point.z / (Math.min(width, height) * 1.4)));
      var radius = orb.size * Math.max(0.72, Math.min(1.25, width / 1100)) * perspective;
      var color = orb.color === "gold" ? {
        bright: "#fff4c6", light: "#ffdf83", mid: "#f5ae22", dark: "#8f4e08", glow: "rgba(245,174,34,.65)"
      } : {
        bright: "#f1fbff", light: "#74d5ff", mid: "#0879c9", dark: "#062554", glow: "rgba(8,121,201,.7)"
      };
      var shadow = context.createRadialGradient(point.x, point.y + radius * 1.2, 0, point.x, point.y + radius * 1.2, radius * 2.2);
      shadow.addColorStop(0, orb.color === "gold" ? "rgba(245,174,34,.26)" : "rgba(8,121,201,.3)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = shadow;
      context.beginPath();
      context.ellipse(point.x, point.y + radius * 1.2, radius * 2.2, radius * 0.72, 0, 0, Math.PI * 2);
      context.fill();

      var metal = context.createRadialGradient(point.x - radius * 0.38, point.y - radius * 0.42, radius * 0.04, point.x, point.y, radius);
      metal.addColorStop(0, "#ffffff");
      metal.addColorStop(0.13, color.bright);
      metal.addColorStop(0.3, color.light);
      metal.addColorStop(0.56, color.mid);
      metal.addColorStop(0.83, color.dark);
      metal.addColorStop(1, "#020a18");
      context.shadowColor = color.glow;
      context.shadowBlur = radius * 1.7;
      context.fillStyle = metal;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      var reflection = context.createRadialGradient(point.x - radius * 0.38, point.y - radius * 0.4, 0, point.x - radius * 0.28, point.y - radius * 0.28, radius * 0.72);
      reflection.addColorStop(0, "rgba(255,255,255,.95)");
      reflection.addColorStop(0.22, "rgba(255,255,255,.38)");
      reflection.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = reflection;
      context.beginPath();
      context.arc(point.x, point.y, radius * 0.84, 0, Math.PI * 2);
      context.fill();
    }

    function drawFrame() {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      var center = logoCenter();
      center.x += pointerX * 7;
      center.y += pointerY * 5;

      trails.forEach(function (trail) {
        drawTrail(center, trail);
      });

      var positions = orbiters.map(function (orb) {
        var angle = orb.angle + elapsed * orb.speed;
        var point = orbitPoint(center, {
          rx: orb.radiusX,
          ry: orb.radiusY,
          depth: orb.depth,
          tilt: 0.34,
          phase: orb.phase
        }, angle);
        point.y += Math.sin(elapsed * 0.75 + orb.phase) * 3.2;
        return { point: point, orb: orb };
      }).sort(function (a, b) {
        return a.point.z - b.point.z;
      });

      positions.forEach(function (entry) {
        if (entry.point.z < 0) {
          context.save();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.ellipse(center.x, center.y, Math.min(width * 0.25, 230), Math.min(height * 0.29, 220), -0.08, 0, Math.PI * 2);
          context.clip("evenodd");
          drawSphere(entry.point, entry.orb);
          context.restore();
        } else {
          drawSphere(entry.point, entry.orb);
        }
      });
    }

    function animate(time) {
      frame = 0;
      if (document.hidden || !isVisible || reduced) return;
      if (lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      pointerX += (targetPointerX - pointerX) * 0.04;
      pointerY += (targetPointerY - pointerY) * 0.04;
      drawFrame();
      frame = window.requestAnimationFrame(animate);
    }

    function resume() {
      if (!frame && !document.hidden && isVisible && !reduced) {
        lastTime = 0;
        frame = window.requestAnimationFrame(animate);
      }
    }

    hero.addEventListener("pointermove", function (event) {
      var bounds = hero.getBoundingClientRect();
      targetPointerX = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      targetPointerY = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      if (reduced) {
        pointerX = targetPointerX;
        pointerY = targetPointerY;
        drawFrame();
      }
    });
    hero.addEventListener("pointerleave", function () {
      targetPointerX = 0;
      targetPointerY = 0;
      if (reduced) {
        pointerX = 0;
        pointerY = 0;
        drawFrame();
      }
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        resume();
      }
    });
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
        if (!isVisible && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        } else {
          resume();
        }
      });
      observer.observe(hero);
    }
    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeCanvas).observe(heroScene);
    } else {
      window.addEventListener("resize", resizeCanvas, { passive: true });
    }
    image.addEventListener("load", resizeCanvas, { once: true });
    resizeCanvas();
    resume();
  }

  startLogoOrbits();

  var form = document.getElementById("enquiry-form");
  var feedback = document.getElementById("form-feedback");
  var config = window.KAGE_CONTACT_CONFIG || {};
  var formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();
  if (formspreeEndpoint === "YOUR_FORMSPREE_ENDPOINT") formspreeEndpoint = "";
  function validateField(field) {
    var message = "";
    var value = field.value.trim();
    if (field.required && !value) {
      message = "Please complete this field.";
    } else if (field.name === "contact" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/^[+\d(][\d\s().-]{5,}$/.test(value)) {
      message = "Enter a valid email address or phone number.";
    }
    var error = field.parentElement.querySelector(".field-error");
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }
  var isSubmitting = false;

  form.addEventListener("input", function (event) {
    if (event.target.matches("input, textarea, select")) {
      validateField(event.target);
      feedback.textContent = "";
      feedback.classList.remove("is-error");
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isSubmitting) return;
    var fields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    var valid = fields.map(validateField).every(Boolean);
    feedback.textContent = "";
    feedback.classList.remove("is-error");
    if (!valid) {
      form.querySelector('[aria-invalid="true"]').focus();
      feedback.textContent = "Please check the highlighted fields.";
      feedback.classList.add("is-error");
      return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    isSubmitting = true;
    submitButton.disabled = true;
    try {
      var formData = new FormData(form);
      var data = {
        name: String(formData.get("name") || "").trim(),
        business_name: String(formData.get("business") || "").trim() || null,
        business_type: String(formData.get("businessType") || "").trim() || null,
        contact: String(formData.get("contact") || "").trim(),
        solution: String(formData.get("solution") || ""),
        requirements: String(formData.get("requirements") || "").trim(),
        budget: String(formData.get("budget") || "") || null
      };

      if (formData.get("website")) {
        return;
      }

      if (!formspreeEndpoint) {
        throw new Error("Formspree is not configured. Set VITE_FORMSPREE_ENDPOINT.");
      }

      var response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Formspree returned " + response.status + ".");
      }

      form.reset();
      feedback.classList.remove("is-error", "is-demo");
      feedback.textContent = "Thank you. Your enquiry has been submitted.";
    } catch (error) {
      console.error("Unable to submit enquiry:", error);
      feedback.textContent = error.message.indexOf("Formspree is not configured.") === 0
        ? "The contact form is not connected yet. Please email " + config.email + " while we finish the setup."
        : "We couldn’t submit your enquiry. Please try again later or email " + config.email + ".";
      feedback.classList.add("is-error");
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

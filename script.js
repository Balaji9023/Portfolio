/**
 * JAYABALAJI S — CREATIVE AI & COMPUTER VISION ENGINEER
 * Awsmd / Sam Halpert Portfolio Interactive Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  initConstellationBackground();
  initFloatingDock();
  initHeroTilt();
  initTerminalRepl();
  initCaseFilters();
  initTelemetrySimulations();
  initClipboardAndToasts();
  initContactSubmission();
  initScrollSpy();
});

/* ==========================================================================
   1. FLOATING ISLAND DOCK & MOBILE NAVIGATION
   ========================================================================== */
function initFloatingDock() {
  const menuBtn = document.getElementById("dockMenuBtn");
  const dockLinks = document.getElementById("dockLinks");
  const navDock = document.getElementById("navDock");
  const links = document.querySelectorAll(".dock-link");

  if (menuBtn && dockLinks) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);
      dockLinks.classList.toggle("active");
    });

    links.forEach(link => {
      link.addEventListener("click", () => {
        dockLinks.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navDock.contains(e.target) && dockLinks.classList.contains("active")) {
        dockLinks.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/* ==========================================================================
   2. SCROLL SPY FOR DOCK LINKS
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const dockLinks = document.querySelectorAll(".dock-link");

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -60% 0px",
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        dockLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => spyObserver.observe(sec));
}

/* ==========================================================================
   3. 3D PERSPECTIVE TILT ON SIGNATURE PORTRAIT CARD
   ========================================================================== */
function initHeroTilt() {
  const wrapper = document.getElementById("heroCardWrapper");
  const card = document.getElementById("heroPortraitCard");

  if (!wrapper || !card) return;

  if (window.matchMedia("(pointer: fine)").matches) {
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }
}

/* ==========================================================================
   4. DEVELOPER TERMINAL REPL ENGINE
   ========================================================================== */
function initTerminalRepl() {
  const form = document.getElementById("termMiniForm");
  const input = document.getElementById("termInput");
  const output = document.getElementById("termOutputLines");
  const consoleBody = document.getElementById("termConsoleBody");
  const quickBtns = document.querySelectorAll(".term-quick-btn");

  if (!form || !input || !output) return;

  const COMMANDS = {
    help: () => `
      <div class="term-ans">
        <strong class="green">Commands available:</strong><br>
        • <span class="green">skills</span>: List technical skills & frameworks<br>
        • <span class="green">projects</span>: View project experience<br>
        • <span class="green">about</span>: Candidate summary & background<br>
        • <span class="green">contact</span>: Direct coordinates (Email, Phone, LinkedIn, GitHub)<br>
        • <span class="green">clear</span>: Flush console output
      </div>
    `,
    skills: () => `
      <div class="term-ans">
        <strong class="green">Technical Arsenal:</strong><br>
        [AI & Vision]   OpenCV, YOLO (Ultralytics), TensorFlow, NLP, Object Detection, Real-time Video Processing<br>
        [Languages]     Python, JavaScript, SQL, Java, C/C++<br>
        [Backend/Cloud] Flask, FastAPI, REST APIs, Docker, AWS, Google Cloud Platform<br>
        [Tools]         Git, VS Code
      </div>
    `,
    projects: () => `
      <div class="term-ans">
        <strong class="green">Projects:</strong><br>
        1. <strong>Smart Intrusion Detection System</strong> (Jan 2026 – Apr 2026) | Python, OpenCV, TensorFlow, YOLO, CCTV, Flask<br>
        2. <strong>Serenity AI Chatbot</strong> (Jun 2025 – Oct 2025) | Python, Flask, REST APIs, JavaScript, Tailwind CSS, NLP
      </div>
    `,
    resume: () => {
      const a = document.createElement("a");
      a.href = "assets/jayabalaji_resume.pdf";
      a.download = "Jayabalaji_S_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return `
        <div class="term-ans">
          <strong class="green">✓ Downloading Jayabalaji S Resume (PDF)...</strong><br>
          <span class="muted-text">File: Jayabalaji_S_Resume.pdf</span>
        </div>
      `;
    },
    about: () => `
      <div class="term-ans">
        <strong>Jayabalaji S</strong> — AI & Data Science Graduate (B.Tech 2022–2026, DMI College of Engineering, Chennai).<br>
        AI & Data Science graduate with hands-on experience building computer vision and NLP applications in Python. Skilled in YOLO, OpenCV, TensorFlow, and Flask.
      </div>
    `,
    contact: () => `
      <div class="term-ans">
        <strong>Direct Coordinates:</strong><br>
        Email: <a href="mailto:balaji9023@gmail.com" class="green">balaji9023@gmail.com</a><br>
        Phone: <a href="tel:+919003979386" class="green">+91 90039 79386</a><br>
        LinkedIn: <a href="https://linkedin.com/in/balajis" target="_blank" class="blue">linkedin.com/in/balajis</a><br>
        GitHub: <a href="https://github.com/Balaji9023" target="_blank" class="blue">github.com/Balaji9023</a>
      </div>
    `,
    clear: () => {
      output.innerHTML = "";
      return null;
    }
  };

  function runCmd(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const logLine = document.createElement("p");
    logLine.className = "term-log";
    logLine.innerHTML = `<span class="green">guest@portfolio</span>:<span class="blue">~</span>$ ${escapeHtml(rawCmd)}`;
    output.appendChild(logLine);

    if (COMMANDS[cmd]) {
      const res = COMMANDS[cmd]();
      if (res) {
        const div = document.createElement("div");
        div.innerHTML = res;
        output.appendChild(div);
      }
    } else {
      const err = document.createElement("div");
      err.className = "term-ans";
      err.innerHTML = `command not found: <span style="color: #f87171;">${escapeHtml(cmd)}</span>. Type '<span class="green">help</span>' for commands.`;
      output.appendChild(err);
    }

    input.value = "";
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runCmd(input.value);
  });

  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (cmd) runCmd(cmd);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* =========================================
   5. CASE STUDY CATEGORY FILTERS
   ========================================= */
function initCaseFilters() {
  const tabs = document.querySelectorAll(".case-filters .filter-tab");
  const cards = document.querySelectorAll(".cases-list .case-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const filter = tab.getAttribute("data-filter");

      cards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 40);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

/* =========================================
   6. LIVE TELEMETRY SIMULATIONS (FPS & CHAT)
   ========================================= */
function initTelemetrySimulations() {
  // CCTV FPS fluctuation
  const fpsElem = document.getElementById("cctvFps");
  if (fpsElem) {
    setInterval(() => {
      const fps = (47.6 + Math.random() * 2.2).toFixed(1);
      fpsElem.textContent = `${fps} FPS`;
    }, 1800);
  }

  // Interactive Chat Query Simulation
  const simBtn = document.getElementById("chatSimulateBtn");
  const stream = document.getElementById("chatStream");
  const typing = document.getElementById("chatTypingPill");

  if (!simBtn || !stream) return;

  const QUERIES = [
    {
      q: "How are automated responses generated?",
      a: "Natural Language Processing (NLP) techniques parse input intents, serving responses via Flask REST APIs."
    },
    {
      q: "What technologies power the Serenity AI Chatbot?",
      a: "Python, Flask REST APIs, JavaScript, Tailwind CSS, and custom NLP pipelines."
    },
    {
      q: "Is the chatbot connected to a web interface?",
      a: "Yes! The trained model is exposed through REST endpoints and connected directly to a browser interface."
    }
  ];

  let queryIndex = 0;

  simBtn.addEventListener("click", () => {
    const pair = QUERIES[queryIndex % QUERIES.length];
    queryIndex++;

    const userBubble = document.createElement("div");
    userBubble.className = "msg user-bubble";
    userBubble.textContent = pair.q;
    stream.insertBefore(userBubble, typing);

    typing.style.display = "flex";

    setTimeout(() => {
      typing.style.display = "none";
      const aiBubble = document.createElement("div");
      aiBubble.className = "msg ai-bubble";
      aiBubble.innerHTML = `<span class="ai-role">SERENITY AI</span>${pair.a}`;
      stream.insertBefore(aiBubble, typing);
      stream.scrollTop = stream.scrollHeight;
    }, 1000);
  });
}

/* =========================================
   7. 1-CLICK CLIPBOARD COPY & TOAST ENGINE
   ========================================= */
function initClipboardAndToasts() {
  const copyBtns = document.querySelectorAll(".copy-email-btn");

  copyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email") || "balaji9023@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showAwsmdToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        const fallback = document.createElement("textarea");
        fallback.value = email;
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        document.body.removeChild(fallback);
        showAwsmdToast(`Copied ${email} to clipboard!`);
      });
    });
  });
}

let toastTimeout = null;
function showAwsmdToast(msg) {
  const toast = document.getElementById("toastCard");
  const txt = document.getElementById("toastTxt");

  if (!toast || !txt) return;

  txt.textContent = msg;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* =========================================
   8. CONTACT FORM SUBMISSION
   ========================================= */
function initContactSubmission() {
  const form = document.getElementById("awsmdContactForm");
  const btn = document.getElementById("formSubmitBtn");

  if (!form || !btn) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fName").value;
    const email = document.getElementById("fEmail").value;
    const role = document.getElementById("fRole").value;
    const message = document.getElementById("fMessage").value;

    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span>Transmitting...</span>`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<span>Message Sent ✓</span>`;
      showAwsmdToast(`Thank you ${name}! Opening mail client...`);

      const mailto = `mailto:balaji9023@gmail.com?subject=${encodeURIComponent(role + " - from " + name)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      window.location.href = mailto;

      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalHtml;
      }, 3000);
    }, 850);
  });
}

/* ==========================================================================
   9. INTERACTIVE 3D CONSTELLATION BACKGROUND (KUGAN STYLE)
   ========================================================================== */
function initConstellationBackground() {
  const canvas = document.getElementById("bgConstellationCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 50 : 105;
  const maxDistance = isMobile ? 95 : 125;

  // Particle color palette: Warm Gold (#D6A84F), Champagne Gold (#F0C96A), Soft Highlight (#FFE39A), Warm White (#F5F3ED)
  const COLORS = [
    { r: 214, g: 168, b: 79 },  // Warm Gold
    { r: 240, g: 201, b: 106 }, // Champagne Gold
    { r: 255, g: 227, b: 154 }, // Highlight Gold
    { r: 245, g: 243, b: 237 }  // Warm White
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.z = Math.random() * 400 - 200; // 3D depth
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = Math.random() * 0.4 + 0.15; // Gentle downward drift
      this.vz = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 1.6 + 1.0;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.4 + 0.4;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update(mouseX, mouseY) {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      this.pulseAngle += this.pulseSpeed;

      // Wrap around screen edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y > height + 20) this.reset(false);
      if (this.z < -200 || this.z > 200) this.vz *= -1;

      // Mouse interactive push / deflection
      if (mouseX !== null && mouseY !== null) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      // 3D perspective projection
      const fov = 350;
      const scale = fov / (fov + this.z);
      const projX = this.x;
      const projY = this.y;
      const r = this.radius * scale;
      const currentAlpha = Math.max(0.1, (this.alpha + Math.sin(this.pulseAngle) * 0.15) * Math.min(1, scale));

      ctx.beginPath();
      ctx.arc(projX, projY, Math.max(0.5, r), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
      ctx.fill();

      // Subtle glow on larger nodes
      if (this.radius > 1.8) {
        ctx.beginPath();
        ctx.arc(projX, projY, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.25})`;
        ctx.fill();
      }
    }
  }

  // 3D Rotating Geometric Core (Icosahedron projection like Kugan's Three.js core)
  const phi = (1 + Math.sqrt(5)) / 2;
  const coreVertices = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
  ];
  const coreEdges = [
    [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
    [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11]
  ];

  let rotX = 0;
  let rotY = 0;
  let rotZ = 0;

  const particles = Array.from({ length: particleCount }, () => new Particle());

  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  let isVisible = true;
  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;
  });

  function render() {
    if (!isVisible) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Draw central 3D wireframe core (slowly rotating in upper-middle background)
    rotX += 0.003;
    rotY += 0.004;
    rotZ += 0.002;

    const coreCenterX = width * 0.72;
    const coreCenterY = height * 0.38;
    const coreRadius = isMobile ? 70 : 130;

    const projectedCore = coreVertices.map(([vx, vy, vz]) => {
      // Rotation around X
      let y1 = vy * Math.cos(rotX) - vz * Math.sin(rotX);
      let z1 = vy * Math.sin(rotX) + vz * Math.cos(rotX);
      // Rotation around Y
      let x2 = vx * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -vx * Math.sin(rotY) + z1 * Math.cos(rotY);
      // Rotation around Z
      let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

      const scale = 300 / (300 + z2 * 30);
      return {
        x: coreCenterX + x3 * (coreRadius / 2) * scale,
        y: coreCenterY + y3 * (coreRadius / 2) * scale,
        scale
      };
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(214, 168, 79, 0.15)";
    coreEdges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(projectedCore[i].x, projectedCore[i].y);
      ctx.lineTo(projectedCore[j].x, projectedCore[j].y);
      ctx.stroke();
    });

    projectedCore.forEach((v) => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 2.2 * v.scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240, 201, 106, 0.45)";
      ctx.fill();
    });

    // 2. Update & draw particle network
    particles.forEach(p => p.update(mouse.x, mouse.y));

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.30;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(214, 168, 79, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Dynamic mouse connection line
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160) {
          const mAlpha = (1 - mDist / 160) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 227, 154, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
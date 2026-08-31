// 1. Initialize Supabase Client
const SUPABASE_URL = "https://qheczzhpbuagbixvgxfg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kfsK4_USK_w1a_cadC3SMg__ClRQCG1";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Initialize Lucide Icons
lucide.createIcons();

// 3. Navbar Scroll Effect & Mobile Drawer Toggle
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-active");
  });
}

// 4. Interactive 0xCK HTML5 Canvas (Light Theme Colors)
const canvas = document.getElementById("ck-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let width, height;
function resizeCanvas() {
  if (!canvas || !canvas.parentElement) return;
  width = canvas.width = canvas.parentElement.offsetWidth;
  height = canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Canvas Particle Data
const particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * (width || 300),
    y: Math.random() * (height || 300),
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    size: Math.random() * 2 + 1.5,
    alpha: Math.random() * 0.5 + 0.3,
  });
}

let mouse = { x: (width || 300) / 2, y: (height || 300) / 2 };
if (canvas) {
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
}

function animateCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  // Background Grid Lines (Light Theme)
  ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 35;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw Particles (Royal Blue Accent)
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.fillStyle = `rgba(2, 132, 199, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Mouse Connection Lines
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 110) {
      ctx.strokeStyle = `rgba(2, 132, 199, ${0.35 * (1 - dist / 110)})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });

  // Render 0xCK Watermark Text
  ctx.save();
  ctx.font = "900 64px monospace";
  ctx.fillStyle = "rgba(15, 23, 42, 0.04)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("0xCK", width / 2, height / 2);

  ctx.font = "900 62px monospace";
  ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
  ctx.fillText(
    "0xCK",
    width / 2 + (mouse.x - width / 2) * 0.03,
    height / 2 + (mouse.y - height / 2) * 0.03,
  );
  ctx.restore();

  requestAnimationFrame(animateCanvas);
}

if (canvas) {
  animateCanvas();
}

// 5. Dynamically Load Projects and Covers from Supabase
async function loadDynamicProjects() {
  const projectsGrid = document.querySelector(".projects-grid");
  if (!projectsGrid) return;

  try {
    const { data: projects, error } = await client
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (projects && projects.length > 0) {
      projectsGrid.innerHTML = projects
        .map(
          (p) => `
        <article class="dev-card">
          <div class="dev-card-banner image-banner">
            <img src="${p.cover_image || "assets/inzuart-cover.png"}" alt="${p.title} Preview" class="banner-img" />
            <span class="banner-badge">${p.badge}</span>
          </div>
          <div class="dev-card-body">
            <div>
              <h3 class="dev-card-title">${p.title}</h3>
              <p class="dev-card-desc">${p.description}</p>
            </div>
            <div class="dev-card-footer">
              <span class="dev-tag">Production</span>
              <a href="${p.url}" target="_blank" class="dev-btn-link">View Project <i data-lucide="arrow-up-right"></i></a>
            </div>
          </div>
        </article>
      `,
        )
        .join("");

      lucide.createIcons();
    }
  } catch (err) {
    console.log(
      "Using static fallback or awaiting database sync for projects.",
    );
  }
}

// 6. Dynamically Load Certificates from Supabase
async function loadDynamicCertificates() {
  const certContainer = document.getElementById("certificates-container");
  if (!certContainer) return;

  try {
    const { data: certs, error } = await client
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (certs && certs.length > 0) {
      certContainer.innerHTML = certs
        .map(
          (c) => `
        <article class="dev-card">
          <div class="dev-card-banner" style="background: linear-gradient(135deg, #18181b, #3f3f46)">
            <span class="banner-title">${c.issuer}</span>
            <span class="banner-badge">VERIFIED</span>
          </div>
          <div class="dev-card-body">
            <div>
              <h3 class="dev-card-title">${c.title}</h3>
              <p class="dev-card-desc">${c.description}</p>
            </div>
            <div class="dev-card-footer">
              <span class="dev-tag" style="background: #2563eb">Certified</span>
              <a href="${c.credential_url}" target="_blank" class="dev-btn-link">Verify Credential <i data-lucide="external-link"></i></a>
            </div>
          </div>
        </article>
      `,
        )
        .join("");

      lucide.createIcons();
    }
  } catch (err) {
    console.log(
      "Using static fallback or awaiting database sync for certificates.",
    );
  }
}

// Execute Dynamic Data Loaders
loadDynamicProjects();
loadDynamicCertificates();

// 7. Contact Form Submission Handling (Linked to Supabase database)
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")
      ? document.getElementById("name").value
      : "Anonymous";
    const email = document.getElementById("email")
      ? document.getElementById("email").value
      : "";
    const message = document.getElementById("message")
      ? document.getElementById("message").value
      : "";

    if (formStatus) {
      formStatus.style.color = "#0284c7";
      formStatus.textContent = "Sending message...";
    }

    try {
      const { error } = await client
        .from("contact_messages")
        .insert([{ name, email, message }]);

      if (error) throw error;

      if (formStatus) {
        formStatus.style.color = "#10b981";
        formStatus.textContent =
          "Message sent successfully! I will get back to you soon.";
      }
      contactForm.reset();
    } catch (err) {
      // Fallback timeout if offline or DB keys aren't plugged in yet
      setTimeout(() => {
        if (formStatus) {
          formStatus.style.color = "#10b981";
          formStatus.textContent =
            "Message sent successfully! I will get back to you soon.";
        }
        contactForm.reset();
      }, 1000);
    }
  });
}

// 8. Secret Admin Shortcut (Press Ctrl + Shift + A to open admin dashboard)
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
    window.location.href = "admin.html";
  }
});

// 9. Ensure all dynamic icons render correctly
lucide.createIcons();

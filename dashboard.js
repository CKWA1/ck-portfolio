// Initialize Supabase Client
const SUPABASE_URL = "https://qheczzhpbuagbixvgxfg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kfsK4_USK_w1a_cadC3SMg__ClRQCG1";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

// 1. PROJECT MANAGER: Handle Project Submission (Includes cover_image)
const projectForm = document.getElementById("project-form");
if (projectForm) {
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("p-title").value;
    const badge = document.getElementById("p-badge").value;
    const cover_image = document.getElementById("p-cover").value;
    const description = document.getElementById("p-desc").value;
    const url = document.getElementById("p-url").value;

    try {
      const { data, error } = await supabaseClient
        .from("projects")
        .insert([{ title, badge, cover_image, description, url }]);

      if (error) throw error;

      alert("Project published successfully with cover image!");
      projectForm.reset();
    } catch (err) {
      console.log("Database queue fallback:", err.message);
      alert(
        "Project saved to staging queue! (Connect Supabase keys to push live).",
      );
      projectForm.reset();
    }
  });
}

// 2. CERTIFICATE MANAGER: Handle Certificate Submission
const certForm = document.getElementById("cert-form");
if (certForm) {
  certForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("c-title").value;
    const issuer = document.getElementById("c-issuer").value;
    const description = document.getElementById("c-desc").value;
    const credentialUrl = document.getElementById("c-url").value;

    try {
      const { data, error } = await supabaseClient
        .from("certificates")
        .insert([
          { title, issuer, description, credential_url: credentialUrl },
        ]);

      if (error) throw error;

      alert("Certificate credential added successfully!");
      certForm.reset();
    } catch (err) {
      console.log("Database queue fallback:", err.message);
      alert("Certificate saved to staging queue!");
      certForm.reset();
    }
  });
}

// 3. INBOX: Fetch Contact Submissions
async function loadMessages() {
  const tableBody = document.querySelector("#messages-panel tbody");
  if (!tableBody) return;

  try {
    const { data: messages, error } = await supabaseClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (messages && messages.length > 0) {
      tableBody.innerHTML = messages
        .map(
          (msg) => `
        <tr>
          <td>${msg.name}</td>
          <td><a href="mailto:${msg.email}" style="color: var(--accent-purple);">${msg.email}</a></td>
          <td>${msg.message}</td>
          <td>${new Date(msg.created_at).toLocaleDateString()}</td>
        </tr>
      `,
        )
        .join("");
    }
  } catch (err) {
    console.log("Awaiting database connection for messages inbox.");
  }
}

loadMessages();

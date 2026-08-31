const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

// 1. Guard: Check if user is already logged in with a valid session
function checkExistingSession() {
  const isAuth = localStorage.getItem("admin_authenticated");
  const authTime = localStorage.getItem("admin_auth_time");
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (
    isAuth === "true" &&
    authTime &&
    Date.now() - parseInt(authTime) <= SESSION_DURATION
  ) {
    // Session is still valid, skip login and jump straight to dashboard
    window.location.href = "dashboard.html";
  }
}

// Run session check immediately when the login page loads
checkExistingSession();

// 2. Handle Login Submission
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    // Simple auth check (Update credentials as desired)
    if (email === "cyubahirokevin01@gmail.com" && password === "admin123") {
      // Stamp the session and timestamp
      localStorage.setItem("admin_authenticated", "true");
      localStorage.setItem("admin_auth_time", Date.now().toString());

      // Redirect to the protected dashboard
      window.location.href = "dashboard.html";
    } else {
      loginError.innerText = "Invalid email or password.";
    }
  });
}

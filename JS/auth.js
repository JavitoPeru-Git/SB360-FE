const API_URL = "http://YOUR_AWS_PUBLIC_IP:8000/api"; // Cambiar por la IP pública de AWS en producción

function togglePassword() {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: "POST"
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      alert(`Bienvenido ${data.nombre}`);
      window.location.href = "pagos.html";
    } else {
      document.getElementById("login-msg").innerText = "Usuario o contraseña incorrectos.";
    }
  } catch (err) {
    document.getElementById("login-msg").innerText = "Error al conectar con el servidor.";
  }
});
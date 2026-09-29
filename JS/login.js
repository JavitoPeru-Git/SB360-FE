// Reemplazar con la IP pública de tu servidor AWS EC2 o dominio
const API_URL = "http://YOUR_AWS_PUBLIC_IP:8000/api";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar nombre de usuario guardado si la opción "Recordarme" estuvo activa
  const savedEmail = localStorage.getItem("remembered_email");
  if (savedEmail) {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.value = savedEmail;
      document.getElementById("remember").checked = true;
    }
  }
});

/**
 * Función para alternar la visibilidad del campo de contraseña (icono de ojo)
 */
function togglePassword() {
  const pwdInput = document.getElementById("password");
  if (pwdInput) {
    pwdInput.type = pwdInput.type === "password" ? "text" : "password";
  }
}

/**
 * Manejador del envío del formulario de inicio de sesión
 */
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;
  const msgContainer = document.getElementById("login-msg");

  // Limpiar mensajes de error previos
  if (msgContainer) msgContainer.innerText = "";

  try {
    // Petición al endpoint de login en FastAPI
    const response = await fetch(`${API_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();

      // Guardar sesión del usuario autenticado
      localStorage.setItem("user", JSON.stringify(data));

      // Gestionar la preferencia "Recordarme"
      if (remember) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      // Confirmar usuario y redirigir
      alert(`Bienvenido de nuevo, ${data.nombre}`);
      window.location.href = "pagos.html";
    } else {
      const errorData = await response.json();
      // Mostrar mensaje de error si el usuario no existe o la contraseña es incorrecta
      if (msgContainer) {
        msgContainer.innerText = errorData.detail || "Usuario o contraseña incorrectos.";
      }
    }
  } catch (err) {
    console.error("Error en la autenticación:", err);
    if (msgContainer) {
      msgContainer.innerText = "Error de conexión con el servidor backend.";
    }
  }
});
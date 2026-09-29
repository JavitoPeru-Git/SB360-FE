const API_URL = "http://YOUR_AWS_PUBLIC_IP:8000/api";
const user = JSON.parse(localStorage.getItem("user"));

// Verificar si el usuario está autenticado
if (!user) {
  alert("Debe iniciar sesión previamente.");
  window.location.href = "login.html";
} else {
  document.getElementById("user-info").innerText = `Residente: ${user.nombre}`;
}

document.getElementById("visita-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre-visitante").value;
  const dni = document.getElementById("dni-visitante").value;
  const fecha = document.getElementById("fecha-visita").value;

  try {
    const response = await fetch(`${API_URL}/visitas/crear?user_id=${user.user_id}&nombre=${encodeURIComponent(nombre)}&dni=${encodeURIComponent(dni)}&fecha=${encodeURIComponent(fecha)}`, {
      method: "POST"
    });

    if (response.ok) {
      const data = await response.json();

      // Limpiar contenedor anterior de QR si existe
      document.getElementById("qrcode").innerHTML = "";

      // Generar el código QR visualmente con QRCode.js
      new QRCode(document.getElementById("qrcode"), {
        text: data.codigo_qr,
        width: 180,
        height: 180
      });

      document.getElementById("codigo-texto").innerText = data.codigo_qr;
      document.getElementById("resultado-qr").style.display = "block";
    } else {
      alert("Error al generar el pase de visita.");
    }
  } catch (err) {
    alert("Error de conexión con el servidor.");
  }
});
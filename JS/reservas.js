const API_URL = "http://YOUR_AWS_PUBLIC_IP:8000/api";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Debe iniciar sesión previamente.");
  window.location.href = "login.html";
} else {
  document.getElementById("user-info").innerText = `Residente: ${user.nombre}`;
}

function calcularTotal() {
  const horas = parseInt(document.getElementById("horas-reserva").value) || 0;
  const tarifaHora = 100.00;
  const garantia = 200.00;
  const total = (horas * tarifaHora) + garantia;
  document.getElementById("monto-calculado").innerText = total.toFixed(2);
}

document.getElementById("reserva-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const area = document.getElementById("area-comun").value;
  const fecha = document.getElementById("fecha-reserva").value;
  const horas = parseInt(document.getElementById("horas-reserva").value);

  try {
    const response = await fetch(`${API_URL}/reservas/crear?user_id=${user.user_id}&area=${encodeURIComponent(area)}&fecha=${encodeURIComponent(fecha)}&horas=${horas}`, {
      method: "POST"
    });

    if (response.ok) {
      const data = await response.json();
      alert(`¡Reserva confirmada con éxito!\n\nDetalle:\n- Área: ${area}\n- Fecha: ${fecha}\n- Horas: ${horas}\n- Alquiler: S/ ${data.monto_alquiler}\n- Garantía: S/ ${data.garantia}\n- Total Pagado/Cargado: S/ ${data.monto_total}`);
    } else {
      alert("No se pudo completar la reserva.");
    }
  } catch (err) {
    alert("Error al conectar con el servidor.");
  }
});
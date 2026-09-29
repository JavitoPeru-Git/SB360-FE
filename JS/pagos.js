const API_URL = "http://YOUR_AWS_PUBLIC_IP:8000/api";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Debe iniciar sesión previamente.");
  window.location.href = "login.html";
}

document.getElementById("user-info").innerText = `Residente: ${user.nombre}`;

async function cargarRecibos() {
  const res = await fetch(`${API_URL}/recibos/pendientes/${user.user_id}`);
  const recibos = await res.json();
  const container = document.getElementById("lista-recibos");
  container.innerHTML = "";
  
  let total = 0;
  recibos.forEach(r => {
    total += r.monto_total;
    container.innerHTML += `
      <div class="card">
        <input type="checkbox" checked disabled>
        <strong>Mes:</strong> ${r.mes} | 
        <strong>Monto:</strong> S/ ${r.monto_total} | 
        <strong>Vence:</strong> ${r.fecha_vencimiento}
        <br><small>Desglose: Ord: S/${r.monto_ordinario} | Ext: S/${r.monto_extraordinario} | Fondo: S/${r.monto_fondo_reserva}</small>
      </div>
    `;
  });
  document.getElementById("monto-total").innerText = total.toFixed(2);
}

async function procesarPago() {
  const metodo = document.getElementById("metodo-pago").value;
  const res = await fetch(`${API_URL}/pagar?metodo_pago=${metodo}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify([1]) // ID del recibo de prueba
  });
  const data = await res.json();
  alert(`Pago Confirmado. Estado: ${data.status}. Código de transacción: ${data.codigo_transaccion}`);
  cargarRecibos();
}

cargarRecibos();
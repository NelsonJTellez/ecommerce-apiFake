import { Sesion } from "../funcionalidades/autenticacion/sesionSingleton";
import { PedidoServicio } from "../servicios/pedidoServicio";
import type { Pedido } from "../servicios/pedidoServicio";

let observer: PedidoServicio | null = null;
let suscripcion: (() => void) | null = null;

/**
 * Renderiza la página de transacciones, se reactualiza automáticamente
 * si el db.json cambia (backend/polling).
 */
export function renderizarPaginaTransacciones(contenedor: HTMLElement) {
  // Limpia suscripción y polling anterior si existe (SPA)
  if (observer && suscripcion) {
    observer.desuscribir(suscripcion);
    suscripcion = null;
    observer.detenerPolling();
    observer = null;
  }

  const sesion = Sesion.obtenerInstancia();
  if (!sesion.estaAutenticado()) {
    location.hash = "#/login";
    return;
  }
  const usuario = sesion.obtenerUsuario()!;

  observer = new PedidoServicio(usuario);

  const render = () => {
    const pedidos: Pedido[] = observer!.allPedidos;
    const total = pedidos.reduce((sum, p) => sum + p.total, 0);

    contenedor.innerHTML = `
      <h2>Transacciones</h2>
      <p><b>Total gastado:</b> $${total.toLocaleString()}</p>
      ${
        pedidos.length === 0
          ? '<p>No hay transacciones registradas.</p>'
          : `<ul class="lista-transacciones">
              ${pedidos.map((p) => `
                <li>
                  <b>${new Date(p.fecha).toLocaleString()}</b>
                  – <span style="color: green"> $${p.total.toLocaleString()} </span><br>
                  <small>Productos:</small>
                  <ul>
                    ${p.items.map(i =>
                      `<li>${i.nombre} (x${i.cantidad}) - $${i.precio.toLocaleString()} c/u</li>`
                    ).join("")}
                  </ul>
                </li>
              `).join("")}
            </ul>`
      }
      <style>
        .lista-transacciones ul {
          margin: 0.3em 0 0.6em 1.2em;
          padding: 0;
          font-size: 0.95em;
        }
        .lista-transacciones li {
          margin-bottom: 1em;
          border-bottom: 1px dashed #bbb;
          padding-bottom: .5em;
        }
      </style>
    `;
  };

  observer.suscribir(render);
  suscripcion = render;
  render();

  // Limpieza total al salir de la página (SPA)
  const observerDOM = new MutationObserver(() => {
    if (!document.body.contains(contenedor) && observer && suscripcion) {
      observer.desuscribir(suscripcion);
      suscripcion = null;
      observer.detenerPolling();
      observer = null;
      observerDOM.disconnect();
    }
  });
  observerDOM.observe(document.body, { childList: true, subtree: true });
}

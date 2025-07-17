import { carritoServicio } from "../../servicios/carritoServicio";
import { obtenerProductos } from "../../servicios/api";
import { renderCarrito } from "../../componentes/carrito/carrito";
import type { ItemCarrito } from "../../componentes/carrito/carrito";
import type { Producto } from "../../servicios/api";
import "../../estilos/modalCarrito.css";

let modal: HTMLDivElement | null = null;
let renderRegistrado = false;
let modalVisible = false; // NUEVO: control de visibilidad modal

function conectarBotones() {
  const cerrarBtn = modal?.querySelector(".btn-cerrar-carrito");
  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", () => {
      console.log("[modalCarrito] Click botón cerrar: ocultando modal");
      esconderModal();
    });
  }

  const limpiarBtn = modal?.querySelector(".btn-limpiar-carrito");
  if (limpiarBtn) {
    limpiarBtn.addEventListener("click", () => {
      if (confirm("¿Seguro que deseas vaciar todo el carrito?")) {
        esconderModal(); // PRIMERO oculta, luego limpia
        setTimeout(() => carritoServicio.limpiar(), 120); // limpiar después de cerrar
      }
    });
  }

  const comprarBtn = modal?.querySelector(".btn-comprar-carrito");
  if (comprarBtn) {
    comprarBtn.addEventListener("click", () => {
      alert("¡Compra exitosa! 🎉 Gracias por tu pedido.");
      esconderModal();
      setTimeout(() => carritoServicio.limpiar(), 120);
    });
  }
}

async function render() {
  if (!modalVisible || !modal) return; // Sólo renderizar si el modal está visible
  const productos: Producto[] = await obtenerProductos();
  const items = carritoServicio.allItems;

  const itemsCarrito: ItemCarrito[] = Object.entries(items)
    .map(([idStr, cantidad]) => {
      const producto = productos.find(
        p => String(p.id) === idStr || p.id === Number(idStr)
      );
      if (!producto) return null;
      return { producto, cantidad };
    })
    .filter(Boolean) as ItemCarrito[];

  if (itemsCarrito.length === 0) {
    modal.innerHTML = `
      <div class="carrito-vacio">
        <h2>Carrito</h2>
        <p>Tu carrito está vacío.<br><span style="font-size:1.4em;">🛒</span></p>
        <div class="footer-vacio">
          <button class="btn-cerrar-carrito">Cerrar</button>
        </div>
      </div>
    `;
    conectarBotones();
    return;
  }

  modal.innerHTML = `
    <div id="carrito-content"></div>
    <div class="botones-carrito-footer">
      <div class="grupo-izq">
        <button class="btn-cerrar-carrito">Cerrar</button>
        <button class="btn-limpiar-carrito">Limpiar</button>
      </div>
      <button class="btn-comprar-carrito">Comprar</button>
    </div>
  `;

  renderCarrito(
    modal.querySelector("#carrito-content")!,
    {
      items: itemsCarrito,
      onIncrementar: id => carritoServicio.incrementar(id),
      onDecrementar: id => carritoServicio.decrementar(id),
      onEliminar: id => carritoServicio.eliminar(id),
    }
  );

  conectarBotones();
}

function esconderModal() {
  if (modal) {
    modal.classList.remove("visible");
    modalVisible = false;
    console.log("[modalCarrito] Modal oculto.");
  }
  carritoServicio.desuscribir(render);
  renderRegistrado = false;
}

export async function mostrarModalCarrito() {
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-carrito";
    modal.className = "modal-carrito";
    document.body.appendChild(modal);
  }

  modal.classList.add("visible");
  modalVisible = true;

  if (!renderRegistrado) {
    carritoServicio.suscribir(render);
    renderRegistrado = true;
  }

  render();
}

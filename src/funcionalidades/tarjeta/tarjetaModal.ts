import type { Producto } from "../../servicios/api";
import "../../estilos/modalTarjetas.css";

let modal: HTMLDivElement | null = null;

export function mostrarTarjetaModal(producto: Producto, esFavorito: boolean, onToggleFavorito: (id: number, fav: boolean) => void) {
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal-tarjeta";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-tarjeta-content">
      <button class="modal-tarjeta-cerrar" title="Cerrar">&times;</button>
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h2>${producto.nombre}</h2>
      <section class="descripcion">
        <h4>Descripción</h4>
        <p>${producto.descripcion || "Sin descripción disponible."}</p>
      </section>      
      <p class="precio">${producto.moneda} $${producto.precio.toLocaleString("es-CO")}</p>
      <button class="btn-agregar-carrito-modal">Agregar al carrito</button>
    </div>
  `;
  modal.classList.add("visible");

  // Cerrar
  modal.querySelector(".modal-tarjeta-cerrar")!.addEventListener("click", () => {
    modal!.classList.remove("visible");
    setTimeout(() => { modal?.remove(); modal = null; }, 180);
  });

  // Agregar al carrito
  modal.querySelector(".btn-agregar-carrito-modal")!.addEventListener("click", () => {
    import("../../servicios/carritoServicio").then(({ carritoServicio }) => {
      carritoServicio.agregar(producto.id);
      modal!.classList.remove("visible");
      setTimeout(() => { modal?.remove(); modal = null; }, 180);
    });
  });

  // Favoritos
  const chk = modal.querySelector<HTMLInputElement>("#check-favorito")!;
  chk.addEventListener("change", () => {
    onToggleFavorito(producto.id, chk.checked);
    // UI: cambia estrella
    const star = modal!.querySelector(".star");
    if (star) star.textContent = chk.checked ? "★" : "☆";
  });
}

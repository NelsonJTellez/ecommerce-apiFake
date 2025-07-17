// src/componentes/TarjetaProducto.ts
import type { Producto } from "../../servicios/api";

export function renderTarjetaProducto(producto: Producto, onAgregar: (id: number) => void): HTMLElement {
  const tarjeta = document.createElement("div");
  tarjeta.className = "producto-card";
  tarjeta.setAttribute("data-id", String(producto.id));

  tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="descripcion">${producto.descripcion}</p>
    <p class="precio">${producto.moneda} $${producto.precio.toLocaleString("es-CO")}</p>
    <button class="btn-agregar">Agregar al carrito</button>
  `;

  tarjeta.querySelector<HTMLButtonElement>(".btn-agregar")!
    .addEventListener("click", () => onAgregar(producto.id));

  return tarjeta;
}

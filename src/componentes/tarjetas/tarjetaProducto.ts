// componentes/tarjetas/tarjetaProducto.ts
import type { Producto } from "../../servicios/api";
export function renderTarjetaProducto(producto: Producto, onClick: () => void): HTMLElement {
  const tarjeta = document.createElement("div");
  tarjeta.className = "producto-card";
  tarjeta.setAttribute("data-id", String(producto.id));
  tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="descripcion">${producto.descripcion}</p>
    <p class="precio">${producto.moneda} $${producto.precio.toLocaleString("es-CO")}</p>
  `;
  tarjeta.addEventListener("click", onClick);
  return tarjeta;
}

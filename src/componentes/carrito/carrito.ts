import type { Producto } from "../../servicios/api";

export type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

export type PropsCarrito = {
  items: ItemCarrito[];
  onIncrementar: (id: number) => void;
  onDecrementar: (id: number) => void;
  onEliminar: (id: number) => void;
};

export function renderCarrito(elemento: HTMLElement, props: PropsCarrito) {
  let total = 0;

  elemento.innerHTML = `
    <table class="tabla-carrito">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Precio total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${props.items.map(({ producto, cantidad }) => {
          const totalProducto = producto.precio * cantidad;
          total += totalProducto;
          return `
            <tr data-id="${producto.id}">
              <td>${producto.nombre}</td>
              <td>
                <button class="btn-decrementar" data-id="${producto.id}">-</button>
                <span>${cantidad}</span>
                <button class="btn-incrementar" data-id="${producto.id}">+</button>
              </td>
              <td>$${totalProducto.toLocaleString("es-CO")}</td>
              <td>
                <button class="btn-eliminar" data-id="${producto.id}">🗑️</button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><b>Total</b></td>
          <td><b>$${total.toLocaleString("es-CO")}</b></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  `;

  // Asignar eventos a los botones
  elemento.querySelectorAll<HTMLButtonElement>('.btn-incrementar').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (!isNaN(id)) props.onIncrementar(id);
    };
  });

  elemento.querySelectorAll<HTMLButtonElement>('.btn-decrementar').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (!isNaN(id)) props.onDecrementar(id);
    };
  });

  elemento.querySelectorAll<HTMLButtonElement>('.btn-eliminar').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (!isNaN(id)) props.onEliminar(id);
    };
  });
}

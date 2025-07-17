import { obtenerProductos } from "../servicios/api";
import { renderTarjetaProducto } from "../componentes/tarjetas/tarjetaProducto"; // <--- Ajústalo a tu path real
import { carritoServicio } from "../servicios/carritoServicio"; // ← IMPORTA EL SERVICIO DEL CARRITO
import type { Producto } from "../servicios/api";
import '../estilos/tarjetaProductos.css';






export async function renderizarPaginaInicio(contenedor: HTMLElement) {
  contenedor.innerHTML = `
    <h2>Bienvenido a la Tienda</h2>
    <div id="productos-container"><p>Cargando productos...</p></div>
  `;

  const productosContainer = document.getElementById("productos-container")!;
  try {
    const productos: Producto[] = await obtenerProductos();

    if (!Array.isArray(productos) || productos.length === 0) {
      productosContainer.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    // Usa el componente desacoplado:
    const grid = document.createElement('div');
    grid.className = "grid-productos";
    productos.forEach(producto => {
      const tarjeta = renderTarjetaProducto(producto, (id) => {
        console.log("[paginaInicio] Botón Agregar al carrito en Tarjeta, id:", id);
        carritoServicio.agregar(id);
      });
      grid.appendChild(tarjeta);
    });
    productosContainer.innerHTML = ""; // Limpia antes de añadir
    productosContainer.appendChild(grid);

  } catch (error) {
    productosContainer.innerHTML = `<p>Error cargando productos</p>`;
    console.error("Error al cargar productos:", error);
  }
}

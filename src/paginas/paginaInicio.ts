import { obtenerProductos } from "../servicios/api";
import { renderTarjetaProducto } from "../componentes/tarjetas/tarjetaProducto";
import { mostrarTarjetaModal } from "../funcionalidades/tarjeta/tarjetaModal";
import type { Producto } from "../servicios/api";
import '../estilos/tarjetaProductos.css';
import "../estilos/filtroBusqueda.css"
// paginas/inicio.ts

import { crearFiltroBusqueda } from "../componentes/filtros/filtroBusqueda";


export async function renderizarPaginaInicio(contenedor: HTMLElement) {
  contenedor.innerHTML = `
    <h2>Bienvenido a la Tienda</h2>
    <div id="contenedor-filtro"></div>
    <div id="productos-container"><p>Cargando productos...</p></div>
  `;

  const contenedorFiltro = contenedor.querySelector("#contenedor-filtro")!;
  const productosContainer = contenedor.querySelector("#productos-container")!;

  let productos: Producto[] = [];

  try {
    productos = await obtenerProductos();

    if (!productosContainer.isConnected) return;
    if (!Array.isArray(productos) || productos.length === 0) {
      productosContainer.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    // Función para renderizar los productos filtrados y ordenados
    const renderProductos = (textoBusqueda: string, orden: string) => {
      if (!productosContainer.isConnected) return;

      let filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(textoBusqueda)
      );

      if (orden === "asc") {
        filtrados.sort((a, b) => a.precio - b.precio);
      } else if (orden === "desc") {
        filtrados.sort((a, b) => b.precio - a.precio);
      }

      const grid = document.createElement('div');
      grid.className = "grid-productos";

      filtrados.forEach(producto => {
        const tarjeta = renderTarjetaProducto(producto, () => mostrarTarjetaModal(producto));
        grid.appendChild(tarjeta);
      });

      productosContainer.innerHTML = "";
      productosContainer.appendChild(grid);
    };

    // Crear filtro solo cuando ya tenemos los productos cargados
    crearFiltroBusqueda(contenedorFiltro, {
      placeholderBusqueda: "Buscar por nombre...",
      onFiltrar: renderProductos,
    });

    // Render inicial con filtro vacío
    renderProductos("", "");

  } catch (error) {
    if (productosContainer.isConnected) {
      productosContainer.innerHTML = `<p>Error cargando productos</p>`;
    }
    console.error("Error al cargar productos:", error);
  }
}

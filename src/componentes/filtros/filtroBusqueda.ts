export interface OpcionesFiltro {
  onFiltrar: (textoBusqueda: string, orden: string) => void;
  placeholderBusqueda?: string;
}

export function crearFiltroBusqueda(contenedor: HTMLElement, opciones: OpcionesFiltro) {
  contenedor.innerHTML = `
    <div class="filtro-busqueda sticky-filtro">
      <input type="text" id="busqueda-nombre" placeholder="${opciones.placeholderBusqueda || 'Buscar...'}" />
      <select id="orden-precio">
        <option value="">Ordenar por precio</option>
        <option value="asc">Precio: Menor a mayor</option>
        <option value="desc">Precio: Mayor a menor</option>
      </select>
    </div>
  `;

  const inputBusqueda = contenedor.querySelector<HTMLInputElement>("#busqueda-nombre")!;
  const selectOrden = contenedor.querySelector<HTMLSelectElement>("#orden-precio")!;

  const dispararEventoFiltrado = () => {
    opciones.onFiltrar(inputBusqueda.value.toLowerCase().trim(), selectOrden.value);
  };

  inputBusqueda.addEventListener("input", dispararEventoFiltrado);
  selectOrden.addEventListener("change", dispararEventoFiltrado);

  const filtroEl = contenedor.querySelector(".filtro-busqueda")!;
  const menuHeader = document.querySelector("header.encabezado");

  const menuAltura = menuHeader?.clientHeight ?? 56; // fallback altura del menú

  const sentinel = document.createElement("div");
  sentinel.style.position = "absolute";
  sentinel.style.top = "0";
  sentinel.style.width = "1px";
  sentinel.style.height = `${filtroEl.clientHeight}px`;
  sentinel.style.pointerEvents = "none";
  contenedor.insertBefore(sentinel, filtroEl);

  new IntersectionObserver(
    ([entry]) => {
      filtroEl.classList.toggle("sticky", entry.intersectionRatio === 0);
      if(entry.intersectionRatio === 0) {
        filtroEl.style.top = `${menuAltura}px`;
      } else {
        filtroEl.style.top = 'initial';
      }
    },
    { threshold: [0] }
  ).observe(sentinel);
}

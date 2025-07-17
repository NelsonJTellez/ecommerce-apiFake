import { renderizarPaginaInicio } from "./paginas/paginaInicio";
import { renderizarPaginaSesion } from "./paginas/paginaSesion";

const rutas: Record<string, (contenedor: HTMLElement) => void> = {
  "/": renderizarPaginaInicio,
  "/login": renderizarPaginaSesion,
};

export function inicializarRutas() {
  window.addEventListener("hashchange", actualizarRuta);
  actualizarRuta();
}

function actualizarRuta() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = "";
  const ruta = location.hash.slice(1) || "/";
  const renderizar = rutas[ruta] || rutas["/"];
  renderizar(app);
}

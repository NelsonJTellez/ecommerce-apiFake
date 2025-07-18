import { renderizarPaginaInicio } from "./paginas/paginaInicio";
import { renderizarPaginaSesion } from "./paginas/paginaSesion";
import { renderizarPaginaTransacciones } from "./paginas/Paginatransacciones";
import { Sesion } from "./funcionalidades/autenticacion/sesionSingleton"; // <-- IMPORTANTE

const rutas: Record<string, (contenedor: HTMLElement) => void> = {
  "/": renderizarPaginaInicio,
  "/login": renderizarPaginaSesion,
  "/transacciones": renderizarPaginaTransacciones,
};

export function inicializarRutas() {
  window.addEventListener("hashchange", actualizarRuta);
  actualizarRuta();
}

function actualizarRuta() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = "";
  let ruta = location.hash.slice(1) || "/";

  // 🚨 PROTEGE la ruta de transacciones
  if (ruta === "/transacciones" && !Sesion.obtenerInstancia().estaAutenticado()) {
    location.hash = "#/login";
    return;
  }

  const renderizar = rutas[ruta] || rutas["/"];
  renderizar(app);
  actualizarMenuEstilosPorRuta(ruta);
}

/**
 * Aplica estilos especiales al menú/header y nav-logo cuando estamos en /transacciones.
 */
function actualizarMenuEstilosPorRuta(ruta: string) {
  const header = document.querySelector("header.encabezado");
  const navLogo = document.getElementById("nav-logo");
  if (!header || !navLogo) return;

  if (ruta === "/transacciones") {
    header.classList.add("transparente-forzada");
    navLogo.classList.add("boton-nav");
  } else {
    header.classList.remove("transparente-forzada");
    navLogo.classList.remove("boton-nav");
  }
}

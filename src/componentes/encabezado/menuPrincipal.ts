import { Sesion } from "../../funcionalidades/autenticacion/sesionSingleton";
import { preferenciasUsuario } from "../../funcionalidades/preferenciasUsuario/preferenciasUsuario";
import { mostrarModalCarrito } from "../../funcionalidades/carrito/carritoModal";
import { carritoServicio } from "../../servicios/carritoServicio";
import "../../estilos/menu.css";


function obtenerElementoPorId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento con ID "${id}" no encontrado.`);
  return el as T;
}

let navLogo: HTMLAnchorElement;

export function crearMenuPrincipal(): void {
  if (document.querySelector("header")) return;

  const header = document.createElement("header");
  header.className = "encabezado";
  header.innerHTML = `
    <nav class="nav-principal">
      <a href="#/" class="nav-logo" id="nav-logo">Inicio</a>
      <div class="nav-acciones">
        <button id="btn-carrito" class="btn-menu" title="Ver carrito">
          🛒 <span id="badge-carrito" class="badge-carrito"></span>
        </button>
        <button id="btn-tema" class="btn-menu" title="Cambiar tema">🌙</button>
        <div class="avatar-contenedor">
          <span id="usuario-nombre" style="margin-right:0.5em; font-weight:600; display:none"></span>
          <button id="btn-hamburguesa" class="btn-hamburguesa" aria-label="Abrir menú de usuario"
            aria-controls="menu-sesion" aria-expanded="false" type="button" tabindex="0" style="display:none">
            <span class="hamburguesa-bar"></span><span class="hamburguesa-bar"></span><span class="hamburguesa-bar"></span>
          </button>
          <div id="menu-sesion" class="menu-sesion oculto" role="menu" aria-label="Menú de usuario">
            <button id="menu-transacciones" class="btn-menu" role="menuitem">Transacciones</button>
            <button id="cerrar-sesion" class="btn-cerrar-sesion" role="menuitem">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>`;
  document.body.prepend(header);

  navLogo = obtenerElementoPorId("nav-logo");
  const btnCarrito = obtenerElementoPorId<HTMLButtonElement>("btn-carrito");
  const btnTema = obtenerElementoPorId<HTMLButtonElement>("btn-tema");
  const btnHamburguesa = obtenerElementoPorId<HTMLButtonElement>("btn-hamburguesa");
  const menuSesion = obtenerElementoPorId<HTMLDivElement>("menu-sesion");
  const cerrarSesion = obtenerElementoPorId<HTMLButtonElement>("cerrar-sesion");
  const menuTransacciones = obtenerElementoPorId<HTMLButtonElement>("menu-transacciones");
  const usuarioNombre = obtenerElementoPorId<HTMLSpanElement>("usuario-nombre");
  const badgeCarrito = obtenerElementoPorId<HTMLSpanElement>("badge-carrito");

  carritoServicio.suscribir(() => {
    const cant = carritoServicio.totalCantidad;
    badgeCarrito.textContent = cant > 0 ? String(cant) : "";
    badgeCarrito.style.opacity = cant > 0 ? "1" : "0";
  });

  function actualizarLogoYSesion(): void {
    const sesion = Sesion.obtenerInstancia();
    const auth = sesion.estaAutenticado();

    if (auth) {
      usuarioNombre.textContent = sesion.obtenerUsuario();
      usuarioNombre.style.display = "";
      btnHamburguesa.style.display = "";
      btnHamburguesa.disabled = false;
      btnHamburguesa.tabIndex = 0;

      navLogo.textContent = "Inicio";
      navLogo.href = "#/";
    } else {
      usuarioNombre.style.display = "none";
      btnHamburguesa.style.display = "none";
      btnHamburguesa.disabled = true;
      btnHamburguesa.tabIndex = -1;

      navLogo.textContent = "Iniciar sesión";
      navLogo.href = "#/login";
    }

    // cerrar menú usuario si estaba abierto
    menuSesion.classList.add("oculto");
    btnHamburguesa.classList.remove("abierto");
    btnHamburguesa.setAttribute("aria-expanded", "false");
  }

  window.addEventListener("hashchange", actualizarLogoYSesion);
  Sesion.obtenerInstancia().suscribir(actualizarLogoYSesion);

  btnCarrito.addEventListener("click", () => {
    if (Sesion.obtenerInstancia().estaAutenticado()) {
      mostrarModalCarrito();
    } else {
      location.hash = "#/login";
    }
  });

  btnTema.addEventListener("click", () => {
    const tema = preferenciasUsuario.tema === "claro" ? "oscuro" : "claro";
    preferenciasUsuario.cambiarTema(tema);
  });

  btnHamburguesa.addEventListener("click", e => {
    e.stopPropagation();
    const expandido = btnHamburguesa.getAttribute("aria-expanded") === "true";
    btnHamburguesa.setAttribute("aria-expanded", (!expandido).toString());
    btnHamburguesa.classList.toggle("abierto");
    menuSesion.classList.toggle("oculto");
  });

  cerrarSesion.addEventListener("click", () => {
    Sesion.obtenerInstancia().cerrarSesion();
    location.hash = "#/login";
    actualizarLogoYSesion();
  });

  menuTransacciones.addEventListener("click", () => {
    location.hash = "#/transacciones";
    navLogo.textContent = Sesion.obtenerInstancia().estaAutenticado() ? "Inicio" : "Iniciar sesión";
    navLogo.href = Sesion.obtenerInstancia().estaAutenticado() ? "#/" : "#/login";
    menuSesion.classList.add("oculto");
    btnHamburguesa.classList.remove("abierto");
    btnHamburguesa.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", e => {
    if (!menuSesion.classList.contains("oculto")) {
      const t = e.target as Node;
      if (!btnHamburguesa.contains(t) && !menuSesion.contains(t)) {
        menuSesion.classList.add("oculto");
        btnHamburguesa.classList.remove("abierto");
        btnHamburguesa.setAttribute("aria-expanded", "false");
      }
    }
  });

  function stickyTransparente(): void {
    const hdr = document.querySelector("header.encabezado");
    if (!hdr) return;
    if (hdr.previousElementSibling?.classList.contains("encabezado-sentinel")) return;

    const sent = document.createElement("div");
    sent.className = "encabezado-sentinel";
    Object.assign(sent.style, {
      position: "absolute", top: "0", width: "1px",
      height: `${hdr.clientHeight}px`, pointerEvents: "none"
    });
    hdr.parentElement!.insertBefore(sent, hdr);

    new IntersectionObserver(
      ([e]) => hdr.classList.toggle("encabezado--transparente", e.intersectionRatio === 0),
      { threshold: [0] }
    ).observe(sent);
  }

  stickyTransparente();
  actualizarLogoYSesion();

  // NUEVO: Al hacer clic en "Inicio", si ya estamos en #/, hace scroll hacia arriba
  navLogo.addEventListener("click", (e) => {
    const sesion = Sesion.obtenerInstancia();
    if (sesion.estaAutenticado() && navLogo.getAttribute("href") === "#/") {
      if (location.hash === "#/") {
        e.preventDefault(); // evita recarga
        window.scrollTo({ top: 0, behavior: "smooth" }); // scroll al tope
      }
    }
  });
}

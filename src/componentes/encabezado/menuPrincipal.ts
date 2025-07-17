import { Sesion } from "../../funcionalidades/autenticacion/sesionSingleton";
import { preferenciasUsuario } from "../../funcionalidades/preferenciasUsuario/preferenciasUsuario";
import { mostrarModalCarrito } from "../../funcionalidades/carrito/carritoModal";
import { carritoServicio } from "../../servicios/carritoServicio";
import "../../estilos/menu.css";

function obtenerElementoPorId<T extends HTMLElement>(id: string): T {
    const elemento = document.getElementById(id);
    if (!elemento) throw new Error(`Elemento con ID "${id}" no encontrado.`);
    return elemento as T;
}

export function crearMenuPrincipal(): void {
    if (document.querySelector("header")) return;

    const encabezado: HTMLElement = document.createElement("header");
    encabezado.className = "encabezado";
    encabezado.innerHTML = `
      <nav class="nav-principal">
        <a href="#/" class="nav-logo">Inicio</a>
        <div class="nav-acciones">
          <button id="btn-carrito" class="btn-menu" title="Ver carrito">
            🛒 <span id="badge-carrito" class="badge-carrito"></span>
          </button>
          <button id="btn-tema" class="btn-menu" title="Cambiar tema">🌙</button>
          <div class="avatar-contenedor">
            <span 
              id="usuario-nombre" 
              style="margin-right:0.5em; font-weight:600; display:none"
            ></span>
            <button class="btn-hamburguesa" id="btn-hamburguesa" aria-label="Abrir menú de usuario" aria-expanded="false">
              <span class="hamburguesa-bar"></span>
              <span class="hamburguesa-bar"></span>
              <span class="hamburguesa-bar"></span>
            </button>
            <div id="menu-sesion" class="menu-sesion oculto" role="menu" aria-label="Menú de usuario">
              <button id="cerrar-sesion" class="btn-cerrar-sesion" role="menuitem">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </nav>
    `;
    document.body.prepend(encabezado);

    const btnCarrito = obtenerElementoPorId<HTMLButtonElement>("btn-carrito");
    const btnTema = obtenerElementoPorId<HTMLButtonElement>("btn-tema");
    const btnHamburguesa = obtenerElementoPorId<HTMLButtonElement>("btn-hamburguesa");
    const menuSesion = obtenerElementoPorId<HTMLDivElement>("menu-sesion");
    const cerrarSesion = obtenerElementoPorId<HTMLButtonElement>("cerrar-sesion");
    const usuarioNombre = obtenerElementoPorId<HTMLSpanElement>("usuario-nombre");
    const badgeCarrito = obtenerElementoPorId<HTMLSpanElement>("badge-carrito");

    // Badge reactivo
    function actualizarBadgeCarrito() {
        const cantidad = carritoServicio.totalCantidad;
        badgeCarrito.textContent = cantidad > 0 ? String(cantidad) : "";
        badgeCarrito.style.opacity = cantidad > 0 ? "1" : "0";
    }
    carritoServicio.suscribir(actualizarBadgeCarrito);
    actualizarBadgeCarrito();

    // Muestra el nombre de usuario a la izquierda de la hamburguesa solo si hay sesión
    function actualizarMenuSesion(): void {
        const sesion = Sesion.obtenerInstancia();
        if (sesion.estaAutenticado()) {
            const usuario = sesion.obtenerUsuario();
            usuarioNombre.textContent = usuario;
            usuarioNombre.style.display = ""; // Mostramos el nombre
            menuSesion.classList.add("oculto");
        } else {
            usuarioNombre.textContent = "";
            usuarioNombre.style.display = "none"; // Oculta el nombre
            menuSesion.classList.add("oculto");
        }
        btnHamburguesa.setAttribute("aria-expanded", "false");
    }

    btnCarrito.addEventListener("click", () => {
        const sesion = Sesion.obtenerInstancia();
        if (sesion.estaAutenticado()) {
            mostrarModalCarrito();
        } else {
            location.hash = "#/login";
        }
    });

    btnTema.addEventListener("click", () => {
        const nuevoTema: "claro" | "oscuro" = preferenciasUsuario.tema === "claro" ? "oscuro" : "claro";
        preferenciasUsuario.cambiarTema(nuevoTema);
    });

    btnHamburguesa.addEventListener("click", (e) => {
        e.stopPropagation();
        const expandido = btnHamburguesa.getAttribute("aria-expanded") === "true";
        btnHamburguesa.setAttribute("aria-expanded", (!expandido).toString());
        menuSesion.classList.toggle("oculto");
    });

    cerrarSesion.addEventListener("click", () => {
        Sesion.obtenerInstancia().cerrarSesion();
        location.hash = "#/login";
        actualizarMenuSesion();
    });

    document.addEventListener("click", (e) => {
        if (!menuSesion.classList.contains("oculto")) {
            const target = e.target as Node;
            if (!btnHamburguesa.contains(target) && !menuSesion.contains(target)) {
                menuSesion.classList.add("oculto");
                btnHamburguesa.setAttribute("aria-expanded", "false");
            }
        }
    });

    function activarEncabezadoTransparenteSticky(selector: string = '.encabezado'): void {
        const header = document.querySelector(selector);
        if (!header) return;
        if (header.previousElementSibling?.classList.contains('encabezado-sentinel')) return;
        const sentinel = document.createElement('div');
        sentinel.classList.add('encabezado-sentinel');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.width = '1px';
        sentinel.style.height = `${header.offsetHeight}px`;
        sentinel.style.pointerEvents = 'none';
        header.parentElement?.insertBefore(sentinel, header);

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio === 0) {
                    header.classList.add('encabezado--transparente');
                } else {
                    header.classList.remove('encabezado--transparente');
                }
            },
            { threshold: [0] }
        );
        observer.observe(sentinel);
    }

    activarEncabezadoTransparenteSticky();
    window.addEventListener("hashchange", actualizarMenuSesion);
    actualizarMenuSesion();
}

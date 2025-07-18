import { Observable } from "../utils/Observable";

export interface ISesionStrategy {
  iniciarSesion(usuario: string): void;
  cerrarSesion(): void;
  obtenerUsuario(): string|null;
  estaAutenticado(): boolean;
  suscribir(fn: () => void): void;

}

export class StrategyMultiSesion extends Observable implements ISesionStrategy {
  private usuario: string | null = null;

  constructor() {
    super();
    this.usuario = sessionStorage.getItem("usuario");

    window.addEventListener("storage", (event) => {
      if (event.key === "usuarios_activos") {
        const activos = JSON.parse(localStorage.getItem("usuarios_activos") || "{}");
        if (this.usuario && !activos[this.usuario]) {
          this.cerrarSesion(true);
        }
      }
    });
  }

  iniciarSesion(usuario: string) {
    const activos = JSON.parse(localStorage.getItem("usuarios_activos") || "{}");
    if (activos[usuario]) {
      throw new Error("Este usuario ya tiene una sesión activa en otra pestaña/ventana.");
    }
    activos[usuario] = true;
    localStorage.setItem("usuarios_activos", JSON.stringify(activos));
    sessionStorage.setItem("usuario", usuario);
    this.usuario = usuario;
    this.emitir();
  }

  cerrarSesion(interno = false) {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
      const activos = JSON.parse(localStorage.getItem("usuarios_activos") || "{}");
      delete activos[usuario];
      localStorage.setItem("usuarios_activos", JSON.stringify(activos));
      sessionStorage.removeItem("usuario");
    }
    this.usuario = null;
    this.emitir();

    if (!interno && window.location.hash !== "#/login") {
      alert("La sesión de este usuario  ha finalizado correctamente.");
      window.location.hash = "#/login";
    }
  }

  obtenerUsuario() {
    return this.usuario;
  }

  estaAutenticado() {
    return !!this.usuario;
  }
}

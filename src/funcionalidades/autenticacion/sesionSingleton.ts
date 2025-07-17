/**
 * Singleton para la sesión del usuario.
 * Persiste estado en localStorage.
 */

export class Sesion {
  private static instancia: Sesion;
  private usuario: string | null = null;
  private constructor() {
    this.usuario = localStorage.getItem("usuario");
  }
  static obtenerInstancia() {
    if (!Sesion.instancia) Sesion.instancia = new Sesion();
    return Sesion.instancia;
  }
  iniciarSesion(usuario: string) {
    this.usuario = usuario;
    localStorage.setItem("usuario", usuario);
  }
  cerrarSesion() {
    this.usuario = null;
    localStorage.clear();
    location.reload();
  }
  obtenerUsuario() {
    return this.usuario;
  }
  estaAutenticado() {
    return !!this.usuario;
  }
}

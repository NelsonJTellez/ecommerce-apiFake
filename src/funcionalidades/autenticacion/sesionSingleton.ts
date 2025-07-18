import { carritoServicio } from "../../servicios/carritoServicio";
import type { ISesionStrategy } from "../../utils/strategyMultiSesion"; // Importa solo el tipo

// Por defecto, StrategyMultiSesion, pero puede ser cualquier otra mientras cumpla ISesionStrategy
import { StrategyMultiSesion } from "../../utils/strategyMultiSesion"

export class Sesion {
  private static instancia: Sesion;
  private estrategia: ISesionStrategy;

  private constructor(strategy?: ISesionStrategy) {
    // Si no se pasa ninguna, usa la multi-sesión por defecto
    this.estrategia = strategy || new StrategyMultiSesion();

    // Mantener actualizado el carrito ante cambios de sesión
    this.estrategia.suscribir(() => {
      carritoServicio.setUsuario(this.estrategia.obtenerUsuario());
    });
  }

  static obtenerInstancia(strategy?: ISesionStrategy) {
    if (!Sesion.instancia) Sesion.instancia = new Sesion(strategy);
    return Sesion.instancia;
  }

  iniciarSesion(usuario: string) { this.estrategia.iniciarSesion(usuario); }
  cerrarSesion() { this.estrategia.cerrarSesion(); }
  obtenerUsuario() { return this.estrategia.obtenerUsuario(); }
  estaAutenticado() { return this.estrategia.estaAutenticado(); }
  suscribir(fn: () => void) { this.estrategia.suscribir(fn); }
}

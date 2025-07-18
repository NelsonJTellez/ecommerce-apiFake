import { Observable } from "../utils/Observable";


export type CarritoItem = { id: number, cantidad: number };

function claveStorage(usuario: string | null) {
  return usuario ? `carrito_${usuario}` : "carrito__anonimo";
}

export class CarritoServicio extends Observable {
  private items: Record<number, number> = {};
  private usuario: string | null = localStorage.getItem("usuario") || null;

  constructor() {
    super();
    this.cargar();
    window.addEventListener("storage", (e) => {
      if (e.key === "usuario") {
        this.usuario = localStorage.getItem("usuario");
        this.cargar();
      }
    });
  }

  setUsuario(usuario: string | null) {
    this.usuario = usuario;
    this.cargar();
  }

  private cargar() {
    const clave = claveStorage(this.usuario);
    const data = localStorage.getItem(clave);
    this.items = data ? JSON.parse(data) : {};
    this.emitir();
  }

  private persistir() {
    const clave = claveStorage(this.usuario);
    if (Object.keys(this.items).length > 0) {
      localStorage.setItem(clave, JSON.stringify(this.items));
    } else {
      localStorage.removeItem(clave);
    }
    this.emitir();
  }

  get allItems() {
    return { ...this.items };
  }
  get totalCantidad() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  }
  get totalProductos() {
    return Object.keys(this.items).length;
  }

  agregar(id: number) {
    this.items[id] = (this.items[id] || 0) + 1;
    this.persistir();
  }

  incrementar(id: number) {
    if (this.items[id] != null) {
      this.items[id] += 1;
      this.persistir();
    }
  }

  decrementar(id: number) {
    if (this.items[id] > 1) {
      this.items[id] -= 1;
      this.persistir();
    } else if (this.items[id] === 1) {
      delete this.items[id];
      this.persistir();
    }
  }

  quitar(id: number) {
    this.decrementar(id);
  }

  eliminar(id: number) {
    delete this.items[id];
    this.persistir();
  }

  limpiar() {
    this.items = {};
    const clave = claveStorage(this.usuario);
    localStorage.removeItem(clave);
    this.emitir();
  }
}

export const carritoServicio = new CarritoServicio();

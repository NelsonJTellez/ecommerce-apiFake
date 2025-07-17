// servicios/CarritoServicio.ts

export type CarritoItem = { id: number, cantidad: number };
type Callback = () => void;

export class CarritoServicio {
  private items: Record<number, number> = {};
  private subs: Callback[] = [];

  constructor() {
    this.cargar();
    console.log("[CarritoServicio] Carrito inicial cargado:", this.items);
  }

  private cargar() {
    const data = localStorage.getItem("carrito");
    this.items = data ? JSON.parse(data) : {};
    console.log("[CarritoServicio] Datos cargados de localStorage:", this.items);
  }

  private persistir() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
    console.log("[CarritoServicio] Datos persistidos en localStorage:", this.items);
    this.emitir();
  }

  get allItems() {
    // Obten todis los items en forma { [id]: cantidad }
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
    // Obsoleto, usar decrementar
    this.decrementar(id);
  }

  eliminar(id: number) {
    delete this.items[id];
    this.persistir();
  }

  limpiar() {
    this.items = {};
    this.persistir();
  }

  suscribir(fn: Callback)   {
    this.subs.push(fn);
  }
  desuscribir(fn: Callback) {
    this.subs = this.subs.filter(f => f !== fn);
  }
  emitir() {
    this.subs.forEach(fn => fn());
  }
}

export const carritoServicio = new CarritoServicio();

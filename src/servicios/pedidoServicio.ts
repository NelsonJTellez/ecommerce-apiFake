export type Pedido = {
  id?: number;
  usuario: string;
  fecha: string;
  total: number;
  items: Array<{ id: number; nombre: string; cantidad: number; precio: number }>;
};

const API_URL = "http://localhost:3000";

/** Registrar pedido */
export async function registrarPedido(pedido: Omit<Pedido, "id" | "fecha">): Promise<Pedido> {
  const nuevo: Pedido = {
    ...pedido,
    fecha: new Date().toISOString(),
  };
  const res = await fetch(`${API_URL}/transacciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!res.ok) throw new Error("Error al registrar el pedido");
  return res.json();
}

/** Consulta las transacciones del usuario, ordenadas */
export async function consultarPedidos(usuario: string): Promise<Pedido[]> {
  const res = await fetch(
    `${API_URL}/transacciones?usuario=${encodeURIComponent(usuario)}&_sort=fecha&_order=desc`
  );
  if (!res.ok) throw new Error("Error al consultar los pedidos");
  return res.json();
}

/** Suma total gastado */
export async function totalGastado(usuario: string): Promise<number> {
  const pedidos = await consultarPedidos(usuario);
  return pedidos.reduce((acc, p) => acc + p.total, 0);
}

/** 
 * Patrón Observador con polling automático.
 */
export type SuscriptorPedidos = () => void;
export class PedidoServicio {
  private usuario: string;
  private pedidos: Pedido[] = [];
  private subs: SuscriptorPedidos[] = [];
  private pollIntervalId?: number;

  constructor(usuario: string) {
    this.usuario = usuario;
    this.fetchPedidos();
    // Polling cada 15 segundos
    this.pollIntervalId = window.setInterval(() => {
      this.fetchPedidos();
    }, 15000);
  }

  async fetchPedidos() {
    const pedidos = await consultarPedidos(this.usuario);
    const msUltima = this.pedidos[0]?.fecha || "";
    const msNueva = pedidos[0]?.fecha || "";
    if (msUltima !== msNueva || pedidos.length !== this.pedidos.length) {
      this.pedidos = pedidos;
      this.emitir();
    }
  }

  get allPedidos() {
    return [...this.pedidos];
  }

  suscribir(fn: SuscriptorPedidos) {
    this.subs.push(fn);
  }
  desuscribir(fn: SuscriptorPedidos) {
    this.subs = this.subs.filter(f => f !== fn);
  }
  private emitir() {
    this.subs.forEach(fn => fn());
  }

  // Llamar al salir de la página para limpiar intervalos
  detenerPolling() {
    if (this.pollIntervalId !== undefined) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = undefined;
    }
  }

  async forzarActualizacion() {
    await this.fetchPedidos();
  }
}

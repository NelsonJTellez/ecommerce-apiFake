export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  imagen: string;
};

export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch("http://localhost:3000/productos");
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json(); // <<---- aquí NO uses .productos, devuelve el array directo
}

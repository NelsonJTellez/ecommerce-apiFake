export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  imagen: string;
};

export type Usuario = {
  id: number;
  usuario: string;
  password: string;
};

const API_URL = "http://localhost:3000"; // Cambia si usas otro puerto

export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

// Consultar usuario por nombre (para login o check de duplicados)
export async function existeUsuario(usuario: string): Promise<Usuario | null> {
  const res = await fetch(`${API_URL}/usuarios?usuario=${encodeURIComponent(usuario)}`);
  if (!res.ok) throw new Error("Error al validar usuario");
  const data = await res.json();
  return data[0] || null;
}

// Registrar usuario, retorna el objeto usuario
export async function registrarUsuario(datos: { usuario: string, password: string }): Promise<Usuario> {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}

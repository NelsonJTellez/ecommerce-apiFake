// src/funcionalidades/preferenciasUsuario/estrategiaIdiomas.ts

export class Español {
  traducir(clave: string) {
    const catalogo: Record<string, string> = {
      login: "Iniciar sesión",
      carrito: "Carrito",
      tema: "Tema",
      idioma: "Idioma",
      "cerrar-sesion": "Cerrar sesión"
    };
    return catalogo[clave] || clave;
  }
}

export class Ingles {
  traducir(clave: string) {
    const catalogo: Record<string, string> = {
      login: "Login",
      carrito: "Cart",
      tema: "Theme",
      idioma: "Language",
      "cerrar-sesion": "Log out"
    };
    return catalogo[clave] || clave;
  }
}

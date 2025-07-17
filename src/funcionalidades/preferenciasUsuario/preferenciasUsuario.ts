/**
 * Patrón Strategy para idioma y tema.
 * Gestiona la visualización, traducción dinámica y persistencia de preferencias.
 */
import { Español, Ingles } from "./estrategiaIdiomas";

type Idioma = "es" | "en";
type Tema = "claro" | "oscuro";

export class PreferenciasUsuario {
  private _idiomaActual: Idioma;
  private _tema: Tema;
  private _strategyIdioma: { traducir: (clave: string) => string };

  constructor() {
    // Carga preferencias almacenadas o valores por defecto
    this._idiomaActual = (localStorage.getItem("idioma") as Idioma) || "es";
    this._tema = (localStorage.getItem("tema") as Tema) || "claro";
    this._strategyIdioma = this._idiomaActual === "en" ? new Ingles() : new Español();
    // Aplica tema e idioma al cargar
    document.documentElement.lang = this._idiomaActual;
    document.body.className = this._tema;
  }

  get idiomaActual() {
    return this._idiomaActual;
  }

  get tema() {
    return this._tema;
  }

  traducir(clave: string): string {
    return this._strategyIdioma.traducir(clave);
  }

  cambiarIdioma(nuevo: Idioma) {
    this._idiomaActual = nuevo;
    localStorage.setItem("idioma", nuevo);
    document.documentElement.lang = nuevo;
    this._strategyIdioma = nuevo === "en" ? new Ingles() : new Español();
    // Puedes llamar aquí a una función para actualizar la UI si lo deseas
  }

  cambiarTema(nuevo: Tema) {
    this._tema = nuevo;
    localStorage.setItem("tema", nuevo);
    document.body.className = nuevo;
  }
}

export const preferenciasUsuario = new PreferenciasUsuario();

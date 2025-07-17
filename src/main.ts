import './estilos/base.css';
import './estilos/sesion.css';

import { inicializarRutas } from "./rutas";
import { crearMenuPrincipal } from "./componentes/encabezado/menuPrincipal";

document.body.classList.add('claro');

document.addEventListener("DOMContentLoaded", () => {
  crearMenuPrincipal();
  inicializarRutas();
  
});

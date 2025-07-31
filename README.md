Tienda Online - Proyecto Ecommerce en TypeScript
Descripción
Aplicación web de tienda online desarrollada en TypeScript puro con arquitectura modular. Permite autenticación de usuarios, navegación entre páginas protegidas, visualización dinámica de productos, y gestión básica de sesiones. Está diseñada para practicar buenas prácticas de desarrollo en TypeScript y una estructura escalable para aplicaciones web modernas.

Características principales
Código totalmente escrito en TypeScript con configuración estricta (tsconfig.json) para maximizar seguridad y mantenibilidad.

Modularización clara del código, separando componentes, funcionalidades, servicios y páginas.

Sistema de rutas basado en hash que protege páginas privadas según permisos de sesión.

Gestión de sesión implementada mediante patrón singleton.

Páginas renderizadas dinámicamente con soporte para filtros y ordenamiento.

Interacción con API REST simulada (usando json-server) para consumo de productos y gestión de usuarios.

Validaciones robustas para login y registro, con mensajes de error claros.

UI enfocada en accesibilidad, usabilidad y rendimiento. 

Uso y funcionalidades
Autenticación:

Registro de usuarios con validación de contraseña fuerte (mínimo 9 caracteres, mayúsculas, minúsculas y símbolo).

Login que valida usuario y contraseña, protege contra sesiones duplicadas.

Estado de sesión manejado mediante singleton central.

Navegación:

Páginas gestionadas mediante rutas basadas en hash (inicio, login, transacciones).

Rutas protegidas: /transacciones requiere estar autenticado, sino redirige a login.

Página de inicio (Productos):

Muestra listado dinámico de productos.

Filtro de búsqueda por nombre.

Ordenamiento por precio ascendente o descendente.

Interacción con tarjetas de producto y modales para detalles.

Página de sesiones:

Interfaz para login y registro con pestañas.

Toggle para mostrar/ocultar contraseña.

Manejo de errores y validaciones inline.

Página de transacciones:
(Asumida funcionalidad parcial o base para extender)

Buenas Prácticas Implementadas
Uso del patrón singleton para gestión global de sesión.

Configuración strict de TypeScript para evitar errores y hacer más seguro el código.

Modularización y organización clara para escalabilidad.

Validaciones de usuario y contraseña consistentes y reutilizables.

Manejo de errores con mensajes claros para el usuario.

Separación estricta entre lógica de negocio, UI y servicios API.

Mejoras pendientes y recomendaciones
Implementar hashing seguro para contraseñas.

Validación y autorización del lado servidor.

Manejo avanzado de sesiones y tokens JWT.

Pruebas unitarias e integración (actualmente no incluídas).

Ampliar funcionalidades del dashboard y página de transacciones.

Mejorar accesibilidad y soporte para dispositivos móviles.

Tecnologías usadas
TypeScript 4.x

JSON Server (para mock API REST)

HTML5 y CSS3 (modularizados)

Vanilla JavaScript con módulos ES6+

Herramientas modernas como Vite para bundling y desarrollo local

Contribución
Este repositorio es ideal para aprender buenas prácticas con TypeScript en frontend y estructuras modulares. Se aceptan PR para mejoras, corrección de bugs y ampliación de funcionalidades.

Licencia
Proyecto con licencia MIT - libre para uso, estudio y adaptación.

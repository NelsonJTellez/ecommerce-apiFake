Tienda Online - Proyecto Ecommerce en TypeScript
Overview
Aplicación web modular desarrollada en TypeScript puro para una tienda online con autenticación, rutas protegidas, gestión de productos y sesiones. Organizada para máxima claridad y escalabilidad.

Estructura del proyecto
public/
Recursos públicos estáticos.

src/
Código fuente modularizado:

componentes/
UI reutilizable: tarjetas, filtros, menú.

funcionalidades/
Lógica de dominio: sesión, validación, modales.

paginas/
Vistas para inicio, sesión, transacciones.

rutas.ts
Control del router y protección de rutas.

servicios/
API REST simulada.

utils/
Utilidades y patrones comunes.

main.ts
Punto de entrada bootstrap.

db.json
Base de datos simulada para json-server.

index.html
Página Principal.

package.json
Dependencias y scripts.

tsconfig.json
Configuración TypeScript strict.

Funcionalidades clave
Gestión y protección de rutas con roles y sesión singleton.

CRUD para productos y usuarios con validación.

Filtros y ordenamiento en listado de productos.

Modales interactivos para detalles de productos.

Mensajes de error claros.

Log de operaciones para auditoría.

Cómo usarlo
Instala dependencias.

Levanta json-server con db.json.

Ejecuta servidor de desarrollo.

Accede al frontend en navegador.

Tecnologías
TypeScript

JSON Server

Vanilla JS (modular)

HTML5 y CSS3

Vite (bundler)

Nota para visualización en GitDiagram
Cada carpeta y archivo representa módulos y componentes claves que pueden ser navegados para entender la arquitectura y dependencia. La modularización ayuda a identificar cómo se estructuran y relacionan las partes del proyecto.

Este formato está simplificado para ser leído fácilmente por herramientas visuales tipo GitDiagram, mostrando claramente módulos, rutas, y separaciones funcionales sin texto extenso.

Si quieres, puedo generar también un archivo de texto base con esta estructura para subir directamente o ayudarte a crear un diagrama en GitDiagram usando esta base. ¿Quieres?

Si quieres, puedo generar también un archivo de texto base con esta estructura para subir directamente o ayudarte a crear un diagrama en GitDiagram usando esta base. ¿Quieres? si
Si quieres, puedo generar también un archivo de texto base con esta estructura para subir directamente o ayudarte a crear un diagrama en GitDiagram usando esta base. ¿Quieres? si
Perfecto, aquí tienes un archivo de texto base en formato simple, con la estructura modular del proyecto TypeScript de ecommerce, listo para que lo subas directamente o lo uses como base para generar un diagrama en GitDiagram (compatible con su interpretación de carpetas y archivos):

text
Tienda-Online-Proyecto-Ecommerce-TS/
├── public
│   └── vite.svg
├── src
│   ├── componentes
│   │   ├── carrito
│   │   │   └── carrito.ts
│   │   ├── encabezado
│   │   │   └── menuPrincipal.ts
│   │   ├── filtros
│   │   │   └── filtroBusqueda.ts
│   │   └── tarjetas
│   │       └── tarjetaProducto.ts
│   ├── estilos
│   │   ├── base.css
│   │   ├── carrito.css
│   │   ├── filtroBusqueda.css
│   │   ├── menu.css
│   │   ├── modalCarrito.css
│   │   ├── modalTarjetas.css
│   │   ├── sesion.css
│   │   └── tarjetaProductos.css
│   ├── funcionalidades
│   │   ├── autenticacion
│   │   │   ├── sesionSingleton.ts
│   │   │   └── validarContra.ts
│   │   ├── carrito
│   │   │   └── carritoModal.ts
│   │   ├── preferenciasUsuario
│   │   │   ├── estrategiaIdiomas.ts
│   │   │   └── preferenciasUsuario.ts
│   │   └── tarjeta
│   │       └── tarjetaModal.ts
│   ├── globals-env.d.ts
│   ├── main.ts
│   ├── paginas
│   │   ├── Paginatransacciones.ts
│   │   ├── paginaInicio.ts
│   │   └── paginaSesion.ts
│   ├── rutas.ts
│   ├── servicios
│   │   ├── api.ts
│   │   ├── carritoServicio.ts
│   │   └── pedidoServicio.ts
│   └── utils
│       ├── Observable.ts
│       └── strategyMultiSesion.ts
├── db.json
├── index.html
├── package-lock.json
├── package.json
└── tsconfig.json
Te dejo para copiar y pegar en un archivo .txt o directamente en GitDiagram para visualizar la estructura jerárquica y sus relaciones.

Si quieres, puedo ayudarte a generar un diagrama en formato textual compatible (por ejemplo tipo Mermaid) o darte instrucciones para importarlo en GitDiagram. ¿Quieres avanzar con eso?

Preguntas relacionadas
Qué utilidad tendría un archivo de texto estructurado para diagramar proyectos en GitDiagram
Cómo puedo integrar fácilmente la estructura generada en un diagrama visual
Qué beneficios aporta tener un archivo de texto base para subir o crear diagramas automáticamente
Es posible customizar el contenido del archivo de texto para diferentes tipos de proyectos
Cómo facilita este método la colaboración y comprensión del proyecto entre miembros

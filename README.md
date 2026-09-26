# Portafolio — Juan Camilo Blanco Martinez

Sitio personal de una sola página construido con **HTML, CSS y TypeScript puros**, sin
frameworks ni dependencias en tiempo de ejecución. El contenido procede de las dos hojas
de vida en PDF que están en esta misma carpeta.

## Estructura

Hay una separación estricta entre **fuente** (`src/`, se edita) y **salida**
(`assets/css/styles.css` y `assets/js/`, se generan). Nunca edites la salida: el
siguiente build la sobrescribe.

```
portafolio/
├── index.html              Única página. Todo el contenido vive aquí.
├── src/                    ← FUENTE: esto es lo que se edita
│   ├── main.ts             Punto de entrada: solo decide qué se arranca
│   ├── core/               Ayudantes compartidos, sin estado de negocio
│   │   ├── dom.ts          select / selectAll con tipos
│   │   ├── math.ts         lerp, clamp, easeOutCubic (puras)
│   │   └── motion.ts       prefers-reduced-motion, fuente única de verdad
│   ├── features/           Un archivo por comportamiento, independientes
│   │   ├── reveal.ts       ├── counters.ts      ├── ambient-glow.ts
│   │   ├── scroll-chrome.ts├── role-rotator.ts  ├── tilt.ts
│   │   ├── mobile-nav.ts   ├── skill-filter.ts  └── year.ts
│   │   └── scroll-spy.ts
│   └── css/
│       ├── base/           tokens · reset · utilities · animations
│       ├── layout/         ambient · scroll-progress · header · section · footer
│       ├── components/     REUTILIZABLES: button, chip, skill, filter, stat,
│       │                   panel, timeline, card, cta, code-card, scroll-cue…
│       ├── sections/       Lo específico de cada sección de la página
│       └── settings/       responsive · reduced-motion · forced-colors · print
├── assets/                 ← SALIDA + estáticos
│   ├── css/styles.css      GENERADO por tools/build-css.mjs
│   ├── js/**               GENERADO por tsc (módulos ES, misma estructura)
│   ├── icons/              Logos de tecnologías
│   └── cv-*.pdf            Copia del CV que descarga el visitante
└── tools/build-css.mjs     Ensambla el CSS en un solo archivo
```

### Por qué el CSS se ensambla y el HTML no se parte

El CSS vive en 31 archivos pequeños pero el navegador recibe **uno solo**: una hoja
de estilos bloquea el pintado, así que 31 `<link>` serían 31 bloqueos encadenados. El
coste se paga una vez, en el build. El orden de la cascada está en el array `ARCHIVOS`
de `tools/build-css.mjs` — no lo reordenes sin pensarlo, porque dos reglas con la misma
especificidad se resuelven por orden de aparición.

El `index.html` **sigue siendo un solo archivo a propósito**. Partirlo en parciales
exigiría o bien un motor de plantillas, o bien inyectar el contenido con JavaScript. Lo
segundo vaciaría el HTML que ve un buscador o un lector de pantalla, y tirarías por tierra
el trabajo de SEO y accesibilidad. En una página de contenido, el HTML completo y
declarativo *es* la buena práctica.

### JavaScript: módulos ES nativos, sin empaquetador

`src/main.ts` no tiene lógica: solo importa cada comportamiento y lo arranca dentro de un
`try/catch` individual, para que un fallo en el tilt decorativo no deje el menú muerto.

Las importaciones llevan extensión `.js` (`from './core/dom.js'`) porque es lo que exige
el navegador y TypeScript las deja tal cual. **Consecuencia:** el sitio ya no se puede
abrir con doble clic en `index.html`; los módulos ES requieren `http://`. Usa
`npm run serve`.

La carpeta `portafolio/` es autocontenida: al desplegar (GitHub Pages, Netlify, Vercel…)
se sube solo ella. Por eso el PDF que se descarga desde la web es una **copia** dentro de
`assets/`; los originales se quedan en la carpeta de arriba y no se publican.

> Si actualizas tu hoja de vida, reemplaza también
> `assets/cv-juan-camilo-blanco-martinez.pdf`, que es el archivo que sirve la web.

## Cómo verlo

Hace falta servirlo por HTTP (los módulos ES no funcionan con `file://`):

```bash
npm run serve
```

Queda disponible en <http://localhost:4300>.

## Iconos de marca

| Archivo | Dónde se usa | Qué muestra |
| --- | --- | --- |
| `favicon.ico`, `assets/favicon-16/32/48.png` | Pestaña del navegador | `JC` sobre el degradado |
| `assets/apple-touch-icon.png` | "Añadir a pantalla de inicio" en iOS | `<JCB/>` completo |
| `assets/og-image.png` | Tarjeta al compartir el enlace | Nombre, rol y `<JCB/>` |

Son PNG rasterizados **a propósito, no SVG**: el renderizador de favicons de Chrome no
compone texto, así que un SVG con `<text>` aparece sin letras — solo el fondo. Al
rasterizarlo, las letras son píxeles y funcionan en todos los navegadores.

La pestaña lleva `JC` y no `<JCB/>` porque seis caracteres a 16 píxeles son ilegibles;
la marca completa se reserva para los tamaños grandes, donde sí se lee.

Para regenerarlos hay que rehacer los PNG (se crearon con System.Drawing desde
PowerShell); no basta con editar un SVG.

## Publicar

El sitio es estático y autocontenido: se sube la carpeta `portafolio/` tal cual, sin
compilar nada en el servidor (el JavaScript ya va compilado en `assets/js/`).

**Antes de subirlo, un único paso obligatorio:** en el `<head>` de `index.html` hay tres
líneas comentadas con `TU-DOMINIO.com`. Pon tu dominio real y descoméntalas. Sin eso, al
compartir el enlace en WhatsApp, LinkedIn o X no aparecerá la tarjeta con imagen, porque
esas plataformas exigen una URL **absoluta** en `og:image` y `og:url`. La imagen ya está
hecha (`assets/og-image.png`, 1200×630); solo le falta saber dónde vive.

Opcional: en `robots.txt` hay una línea `Sitemap:` comentada por el mismo motivo.

Dónde subirlo, de menos a más trabajo:

| Servicio | Cómo |
| --- | --- |
| **Netlify Drop** | Arrastras la carpeta a `app.netlify.com/drop`. Sin cuenta, sin git. |
| **Vercel** | `npx vercel` desde esta carpeta. |
| **GitHub Pages** | Requiere crear un repositorio git primero (aún no existe). |

Se pueden subir también `src/`, `tsconfig.json` y este README sin problema: no molestan y
dejan el proyecto reproducible. Si prefieres un despliegue mínimo, basta con `index.html`,
`assets/` y `robots.txt`.

## Cómo modificarlo

El HTML se edita directamente. El CSS y el TypeScript se editan en `src/` y hay que
compilar:

```bash
npm install
npm run build
```

Durante el desarrollo, en dos terminales:

```bash
npm run watch:css
```

```bash
npm run watch:ts
```

**No edites nada dentro de `assets/css/styles.css` ni `assets/js/`**: son salida
generada y el siguiente build se lleva los cambios por delante.

## Iconos de tecnologías

Los logos viven en `assets/icons/` como SVG **dentro del proyecto**: no se cargan desde
ninguna CDN, así que el sitio funciona sin conexión y no depende de un tercero.

Casi todos proceden de [Devicon](https://devicon.dev) (colección bajo licencia MIT) en su
versión a color original. Dos excepciones:

- `serverpod.svg` — Serverpod no está en Devicon. El icono es el cohete azul recortado del
  logotipo horizontal oficial de `serverpod.dev`: se extrajeron los cuatro trazados del
  cohete con sus degradados y se recentraron en un `viewBox` cuadrado, dejando fuera el
  texto "Serverpod". (Ojo: el archivo `logo.svg` de su documentación es la mascota, un
  cocodrilo verde, no el icono del producto.)
- `devops.svg` — dibujado a mano, porque DevOps no es un producto con logotipo.

Las marcas pertenecen a sus respectivos titulares; aquí se usan solo para identificar las
tecnologías con las que se ha trabajado.

Van montados sobre una tarjeta blanca (`.skill__icon`). No es un capricho estético: los
logos de **AWS** (#252f3e) y **Jenkins** (#1d1919) son casi negros y sobre el fondo del
sitio quedaban en 1.36:1 y 1.05:1 de contraste, es decir, invisibles. La tarjeta clara
permite mostrar todos con sus colores oficiales sin retocar ninguno.

Para añadir una tecnología: deja su SVG en `assets/icons/` y copia un `<li class="skill">`
en `index.html` apuntando a él. Recuerda subir también el contador `data-counter` de la
tarjeta "Tecnologías" en la sección Sobre mí.

### Categorías

`data-category` admite **varias categorías separadas por espacios**, así que una misma
tecnología puede salir en más de un filtro: `data-category="lenguajes frontend"` hace que
JavaScript aparezca tanto en "Lenguajes" como en "Frontend". Las categorías disponibles
son `lenguajes`, `frontend`, `movil`, `backend`, `cloud` y `tools`.

## Personalización rápida

Casi todo el aspecto visual sale de las variables CSS en `:root`, al inicio de
`assets/css/styles.css`:

| Variable | Qué controla |
| --- | --- |
| `--accent` / `--accent-2` | Color principal y el degradado del nombre |
| `--bg`, `--surface`, `--surface-2` | Fondos y tarjetas |
| `--text`, `--text-muted`, `--text-dim` | Jerarquía tipográfica |
| `--shell`, `--gutter`, `--section-y` | Anchura y respiración del contenido |
| `--header-h` | Altura de la cabecera (y el desplazamiento de las anclas) |

Los textos, la experiencia y las habilidades están directamente en `index.html`. Para
añadir una tecnología basta con un `<li class="skill" data-category="...">`; el filtro y
el contador se actualizan solos.

## Qué incluye

- Revelado progresivo de secciones con `IntersectionObserver` y retardo escalonado.
- Cabecera fija que se condensa, barra de progreso de lectura y resaltado automático de
  la sección activa en el menú (scroll-spy).
- Menú móvil accesible: se cierra con `Escape`, devuelve el foco al botón y bloquea el
  desplazamiento de fondo.
- Filtro de habilidades por categoría con `aria-pressed` y anuncio del resultado.
- Contadores animados, rotador de roles con control de pausa, glow que sigue al puntero y
  tilt 3D en la tarjeta de código.

## Accesibilidad

- Todos los `aria-labelledby` apuntan a encabezados que existen realmente.
- Enlace de salto al contenido, con `tabindex="-1"` en `<main>` para que el foco se mueva
  de verdad, y `scroll-padding-top` para que no quede tapado por la cabecera.
- Contrastes verificados con la fórmula WCAG sobre **cada** superficie donde se apoya el
  texto, no solo sobre el fondo: el peor caso es 5.2:1, por encima del mínimo AA de 4.5:1.
- Bloque completo de `prefers-reduced-motion`: desactiva animaciones, transiciones,
  desplazamiento suave y el glow ambiental. La preferencia se respeta también si cambia
  con la página ya abierta.
- El rotador de roles tiene un botón de pausa (WCAG 2.2.2: todo texto que se
  auto-actualiza necesita un modo de detenerlo). Al pausar se detiene también el cursor.
- El botón del menú móvil va antes del panel en el DOM, de modo que al abrirlo el foco
  entra en el menú en lugar de saltar al contenido de debajo.
- Los botones de filtro son botones de alternancia reales (`aria-pressed`), no un patrón
  de pestañas incompleto.
- Las listas llevan `role="list"` explícito, porque `list-style: none` elimina la
  semántica de lista en Safari con VoiceOver.

## ⚠️ El PDF que se descarga aún lleva el teléfono y el correo personal

La página ya no muestra el teléfono, y el correo es el laboral
(`blancotech1010@gmail.com`). Pero `assets/cv-juan-camilo-blanco-martinez.pdf` es una
copia de la hoja de vida original, y **dentro del PDF siguen apareciendo el número
3234862550 y `camilo3198@gmail.com`**.

Es decir: la web los oculta, pero se los entrega a quien pulse "Descargar CV". Antes de
publicar el sitio hay que hacer una de estas dos cosas:

1. Regenerar el PDF con los datos de contacto actualizados y reemplazar ese archivo
   (el nombre debe ser el mismo o hay que actualizar los dos enlaces de `index.html`).
2. Quitar los botones "Descargar CV" de `index.html` (la cabecera y la tarjeta de
   contacto) mientras tanto.

## Sobre el contenido

Todo el texto sale de las hojas de vida en PDF. Los cargos por empresa, los niveles de
idioma y cualquier compromiso de disponibilidad **no** aparecen en el CV, así que no
están en el sitio. Si quieres añadirlos, edítalos tú en `index.html` para que digan lo
que de verdad corresponde.

## Notas

- Las tipografías (Inter y JetBrains Mono) se cargan desde Google Fonts; sin conexión el
  sitio cae a las fuentes del sistema sin romperse.
- Hay estilos de impresión: al imprimir se ocultan la navegación y los elementos
  decorativos.

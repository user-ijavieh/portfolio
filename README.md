# Portfolio Editorial — Jerónimo Remedios

Portfolio personal con estética editorial y animaciones scroll-driven.
Construido con Angular 21 y GSAP.

## ✨ Características

- **Hero WebGL/Canvas** — Portal interactivo con partículas de código, efecto typewriter y easter eggs ocultos
- **Scroll-driven animations** — Transiciones cinematográficas con GSAP ScrollTrigger (pin, scrub, snap)
- **Diseño editorial** — Tipografía cuidada, espacio negativo, paleta oscura monocromática
- **Secciones**: Proyectos, Sobre mí, Experiencia, Contacto
- **5 proyectos reales**: SmartEconomato, Rutas Dinámicas, Asistente Virtual, GastroIA, PokeApi
- **Responsive** con soporte para `prefers-reduced-motion`

## 🛠 Stack

- **Framework**: Angular 21 (standalone components)
- **Animaciones**: GSAP 3 + ScrollTrigger
- **Estilos**: SCSS con design tokens (`src/styles/_tokens.scss`)
- **Testing**: Vitest + JSDOM
- **Build**: Angular CLI (`@angular/build`)

## 🚀 Scripts

```bash
npm start      # Dev server en http://localhost:4200
npm run build  # Build de producción
npm test       # Tests con Vitest
```

## 📁 Estructura

```
src/app/
├── core/              # Modelos y servicios
├── features/home/     # Página principal con secciones
│   ├── sections/
│   │   ├── portal/    # Hero WebGL
│   │   ├── works/     # Proyectos
│   │   ├── about/
│   │   ├── experience/
│   │   └── contact/
│   └── home.component.ts  # Orchestrator scroll
└── shared/            # Componentes reutilizables
```

## 🎨 Decisiones de diseño

- **Standalone components** sin NgModules
- **AnimationService** centralizado para gestionar ScrollTriggers
- **Design tokens** SCSS para consistencia tipográfica y de color
- **Hero pinning** en 3 fases: zoom portal → wallpaper → wipe contenido
- **Overlay hover** en tarjetas de proyectos con descripciones

## 📬 Contacto

- **Email**: [jremedioscolmenares@gmail.com](mailto:jremedioscolmenares@gmail.com)
- **GitHub**: [github.com/jremedios](https://github.com/jremedios)
- **LinkedIn**: [linkedin.com/in/jremedios](https://linkedin.com/in/jremedios)
- **Ubicación**: Tenerife, Islas Canarias

## 📄 Licencia

Privado — uso personal.

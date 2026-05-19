# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands use Angular CLI with npm package manager:

```bash
npm start            # Start dev server at http://localhost:4200 (rebuilds on file changes)
npm run build        # Production build with optimizations and hashing
npm test             # Run unit tests with Vitest
npm run watch        # Watch mode for development builds
```

Run a specific test file with Vitest:
```bash
npm test -- src/path/to/file.spec.ts
```

## Architecture Overview

This is an Angular 21 portfolio website with an editorial design aesthetic, featuring scroll-driven animations as a core design pattern.

### Directory Structure

```
src/app/
├── core/                    # Services and shared business logic
│   ├── services/
│   │   ├── animation.service.ts  # GSAP/ScrollTrigger animation management
│   │   └── data.service.ts       # Project content and data
│   └── models/
│       └── project.model.ts      # Project data structure
├── features/
│   └── home/                # Main landing page feature
│       ├── sections/        # Page sections (portal, works, about, etc.)
│       │   ├── portal/      # Hero/portal section with WebGL portal
│       │   ├── works/       # Project showcase
│       │   ├── about/
│       │   ├── experience/
│       │   └── contact/
│       └── home.component.ts # Main orchestrator for scroll animations
├── shared/                  # Reusable components and directives
│   ├── components/
│   │   ├── navigation/
│   │   └── footer/
│   └── directives/
│       └── scroll-reveal.directive.ts
└── styles/
    └── _tokens.scss        # Design tokens and global styles
```

### Key Architectural Patterns

**AnimationService** (`core/services/animation.service.ts`):
- Centralized GSAP animation and ScrollTrigger management
- Pre-built reveal variants: `fadeUp`, `fadeLeft`, `fadeRight`, `scaleIn`, `clipReveal`, `staggerChildren`
- Lifecycle methods: `killAll()`, `removeTrigger()` for cleanup
- Use when adding scroll-triggered animations to components

**HomeComponent** (`features/home/home.component.ts`):
- Orchestrates the entire scroll experience with 3-phase timeline:
  1. **Phase 1 (0-40%)**: Zoom through portal via canvas scaling
  2. **Phase 2 (40-65%)**: Pause on wallpaper-2 background
  3. **Phase 3 (65-100%)**: Wipe horizontal reveal of content
- Uses GSAP timeline with ScrollTrigger pinning
- Manages scroll snap behavior with custom snap function
- Components must handle their own animations once hero sequence completes

**Standalone Components**:
All components use Angular 14+ standalone pattern (no NgModules)
- `imports: [...]` for dependencies instead of module declarations
- Standalone services with `providedIn: 'root'`

**Design Tokens** (`src/styles/_tokens.scss`):
Referenced by `stylePreprocessorOptions.includePaths` in `angular.json`
Import tokens with: `@import 'tokens';`

## Animation & Scroll Interaction Strategy

The portfolio uses scroll-driven pin + wipe transitions:

1. **Hero Section**: Pinned to viewport during scroll (250% scroll distance)
   - First 40%: Portal canvas scales and background shifts
   - 40-65%: Full-bleed wallpaper display
   - 65-100%: Portal section slides out (x: -15vw), content wipes in

2. **Content Sections**: Below-hero sections (works, about, etc.)
   - Use `AnimationService.reveal()` with ScrollTrigger
   - Called in `AfterViewInit` lifecycle
   - ScrollTrigger.refresh() is called in HomeComponent after hero pin to recalculate positions

3. **GSAP Dependencies**: 
   - ScrollTrigger plugin is auto-registered in animation.service.ts and home.component.ts
   - Always register before using: `gsap.registerPlugin(ScrollTrigger);`

## Build Configuration

**Style Processing**:
- Global styles: `src/styles.scss`
- SCSS include path: `src/styles/` (allows `@import 'tokens'`)
- Component styles default to SCSS via `angular.json` schematics

**Assets**:
- Public assets: `public/` folder (e.g., videos, images, config files)
- Src assets: `src/assets/`

**Production Build**:
- Output: `dist/` directory
- Bundle budgets: 500kB initial, 1MB max per component styles
- Output hashing enabled for cache busting

## Testing

Tests use **Vitest** (not Jasmine):
- Test files: `*.spec.ts`
- Configuration: `tsconfig.spec.json`
- JSDOM for DOM simulation
- Run all: `npm test`
- Run specific file: `npm test -- src/path/to/file.spec.ts`

## TypeScript Configuration

Strict mode is enforced with these notable settings:
- `noImplicitOverride`: Require `override` keyword in class inheritance
- `noPropertyAccessFromIndexSignature`: Strict property access
- `strictTemplates`: Strict Angular template type checking

## Deployment & Hosting

- Dev server supports Cloudflare tunnel: `.trycloudflare.com` (allowedHosts in angular.json)
- Standalone Angular app (no hybrid or server-side rendering)

## Performance Considerations

- GSAP animations use `scrub: 1.2` for scroll-linked performance
- Canvas elements in portal section are preloaded before animation
- ScrollTrigger.refresh() required after major DOM changes (hero pin setup)
- Standalone components reduce bundle overhead

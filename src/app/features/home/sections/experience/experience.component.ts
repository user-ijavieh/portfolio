import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('experienceSection') experienceSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('timeline') timeline!: ElementRef;

  skillCategories = [
    {
      title: 'Lenguajes y estilos',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'SCSS']
    },
    {
      title: 'Frontend',
      skills: ['Angular', 'React', 'GSAP', 'Three.js', 'Tailwind CSS']
    },
    {
      title: 'Backend y herramientas',
      skills: ['Node.js', 'NestJS', 'Docker', 'MongoDB', 'PostgreSQL', 'MCP', 'Git']
    }
  ];

  timelineItems = [
    {
      period: 'Feb 2026 — Presente',
      role: 'Desarrollador de Aplicaciones',
      context: 'MCT — Prácticas DAW',
      description: 'Sistema de rutas dinámicas con IA, asistente virtual con MCP propio + LibreChat, y gestión directa con cliente.',
      tags: ['TypeScript', 'Angular', 'React', 'Tailwind CSS', 'NestJS', 'GSAP', 'Anime.js', 'Leaflet']
    },
    {
      period: 'Sept 2025 — Mayo 2026',
      role: 'Líder Frontend',
      context: 'Grupo Turing — TFG',
      description: 'Lideré a 2 compañeros en el desarrollo del frontend e integré un microservicio MCP para contexto del chatbot.',
      tags: ['Angular', 'TypeScript', 'NestJS', 'CSS', 'i18n']
    },
    {
      period: 'Sept 2024 — Mayo 2026',
      role: 'Estudiante DAW',
      context: 'IES Domingo Pérez Minik',
      description: 'Ciclo Superior en Desarrollo de Aplicaciones Web. Base formativa en desarrollo web.',
      tags: []
    }
  ];

  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
  }

  private initAnimations(): void {
    if (this.ctx) return;
    const section = this.experienceSection.nativeElement;

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reset'
        }
      });

      tl.from(this.header.nativeElement.children, {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
      });

      // Timeline animations (horizontal)
      const line = this.timeline.nativeElement.querySelector('.timeline-line');
      const items = this.timeline.nativeElement.querySelectorAll('.timeline-item');

      tl.from(line, {
        scaleX: 0, transformOrigin: 'left center', duration: 1.0, ease: 'power2.out'
      }, '-=0.2');

      tl.from(items, {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out'
      }, '-=0.6');

      // Skills: animate each column with a slight delay between columns
      const skillColumns = section.querySelectorAll('.skills-column');
      skillColumns.forEach((col: Element, i: number) => {
        const skillEls = col.querySelectorAll('.skill-item');
        tl.from(skillEls, {
          x: -20, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out'
        }, `-=${0.4 - (i * 0.1)}`);
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

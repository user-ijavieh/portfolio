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
  @ViewChild('skillsList') skillsList!: ElementRef;
  @ViewChild('timeline') timeline!: ElementRef;

  technicalSkills = [
    'Angular', 'TypeScript', 'GSAP', 'Three.js', 'WebGL',
    'SCSS', 'Tailwind CSS', 'Node.js', 'RxJS',
    'Figma', 'Blender', 'GLSL'
  ];

  timelineItems = [
    {
      period: '2023 — Presente',
      role: 'Desarrollador Creativo Senior',
      context: 'Independiente'
    },
    {
      period: '2021 — 2023',
      role: 'Ingeniero Frontend',
      context: 'Agencia Digital'
    },
    {
      period: '2019 — 2021',
      role: 'Diseñador UI',
      context: 'Estudio de Producto'
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
      // Single trigger for the whole section
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

      const skillEls = this.skillsList.nativeElement.querySelectorAll('.skill-item');
      tl.from(skillEls, {
        x: -20, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out'
      }, '-=0.4');

      const line = this.timeline.nativeElement.querySelector('.timeline-line');
      const items = this.timeline.nativeElement.querySelectorAll('.timeline-item');

      tl.from(line, {
        scaleY: 0, transformOrigin: 'top center', duration: 1.0, ease: 'power2.out'
      }, '-=0.2');
      // Items start at 40% of the line draw (0.6s after line starts, line total is 1.0s)
      tl.from(items, {
        x: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out'
      }, '-=0.6');
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

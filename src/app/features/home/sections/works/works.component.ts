import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DataService } from '../../../../core/services/data.service';
import { Project } from '../../../../core/models/project.model';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './works.component.html',
  styleUrl: './works.component.scss'
})
export class WorksComponent implements AfterViewInit, OnDestroy {
  @ViewChild('worksSection') worksSection!: ElementRef;

  projects: Project[] = [];
  private ctx: gsap.Context | null = null;

  constructor(private dataService: DataService) {
    this.projects = this.dataService.getProjects();
  }

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
  }

  private initAnimations(): void {
    if (this.ctx || !this.worksSection?.nativeElement) return;

    const section = this.worksSection.nativeElement;
    const cards = Array.from(section.querySelectorAll('.work-card')) as HTMLElement[];
    if (!cards.length) return;

    this.ctx = gsap.context(() => {
      const fromVariants: gsap.TweenVars[] = [
        { opacity: 0, y: 70, scale: 0.96 },   // 0: featured — zoom-up
        { opacity: 0, x: 55, y: 20 },          // 1: right — slide desde derecha
        { opacity: 0, x: -45, y: 20 },         // 2: left — slide desde izquierda
        { opacity: 0, x: 50, y: 30 },          // 3: right
        { opacity: 0, y: 60, scale: 0.94 },    // 4: left — zoom-up suave
        { opacity: 0, x: 45 },                 // 5: right — slide limpio
      ];

      const durations = [1.1, 0.9, 1.0, 0.9, 1.05, 0.85];
      const eases = [
        'power3.out', 'power2.out', 'power3.out',
        'power2.out', 'power3.out', 'expo.out'
      ];

      cards.forEach((card, i) => {
        const from = fromVariants[i] ?? { opacity: 0, y: 50 };
        gsap.fromTo(card,
          from,
          {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: durations[i] ?? 0.9,
            ease: eases[i] ?? 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reset'
            }
          }
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

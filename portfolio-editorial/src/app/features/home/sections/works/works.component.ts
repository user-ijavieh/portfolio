import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
  template: `
    <section class="works-section" id="works" #worksSection>
      <div class="works-header">
        <span class="section-label" #label>Selected Works</span>
        <h2 class="section-title" #title>A curated collection<br>of recent projects</h2>
      </div>

      <div class="works-grid" #grid>
        @for (project of projects; track project.id; let i = $index) {
          <article class="work-card" [class.large]="i === 0 || i === 3" [class.offset]="i === 1 || i === 4">
            <div class="work-image-wrapper">
              <img [src]="project.image" [alt]="project.title" loading="lazy">
              <div class="work-overlay">
                <span class="work-view">View Project</span>
              </div>
            </div>
            <div class="work-meta">
              <div class="work-top">
                <span class="work-id">{{ project.id }}</span>
                <span class="work-year">{{ project.year }}</span>
              </div>
              <h3 class="work-title">{{ project.title }}</h3>
              <p class="work-category">{{ project.category }}</p>
              <p class="work-desc">{{ project.description }}</p>
              <div class="work-tags">
                @for (tag of project.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .works-section {
      padding: 10rem 3rem 6rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .works-header {
      margin-bottom: 6rem;
    }

    .section-label {
      display: block;
      font-family: var(--font-main);
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--accent);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 400;
      line-height: 1.15;
      color: var(--text-light);
      letter-spacing: -0.02em;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 2rem;
      row-gap: 4rem;
    }

    .work-card {
      grid-column: span 5;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .work-card.large {
      grid-column: span 7;
    }

    .work-card.offset {
      margin-top: 8rem;
    }

    .work-image-wrapper {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4/5;
      background: var(--border-subtle);
    }

    .work-card.large .work-image-wrapper {
      aspect-ratio: 16/10;
    }

    .work-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .work-card:hover .work-image-wrapper img {
      transform: scale(1.05);
    }

    .work-overlay {
      position: absolute;
      inset: 0;
      background: rgba(5, 5, 5, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .work-card:hover .work-overlay {
      opacity: 1;
    }

    .work-view {
      font-family: var(--font-main);
      font-size: 0.875rem;
      color: var(--text-light);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--text-light);
      transition: all 0.3s ease;
    }

    .work-view:hover {
      background: var(--text-light);
      color: var(--bg-dark);
    }

    .work-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .work-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .work-id {
      font-family: var(--font-main);
      font-size: 0.75rem;
      color: var(--accent);
      letter-spacing: 0.1em;
    }

    .work-year {
      font-family: var(--font-main);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .work-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 400;
      color: var(--text-light);
      letter-spacing: -0.01em;
    }

    .work-category {
      font-family: var(--font-main);
      font-size: 0.875rem;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .work-desc {
      font-size: 0.9375rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-top: 0.5rem;
    }

    .work-tags {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 0.75rem;
      color: var(--text-muted);
      padding: 0.25rem 0.75rem;
      border: 1px solid var(--border-subtle);
      transition: all 0.3s ease;
    }

    .tag:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
  `]
})
export class WorksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('worksSection') worksSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('grid') grid!: ElementRef;

  projects: Project[] = [];
  private triggers: ScrollTrigger[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.projects = this.dataService.getProjects();
  }

  ngAfterViewInit(): void {
    this.initRevealAnimations();
  }

  private initRevealAnimations(): void {
    const cards = this.grid.nativeElement.querySelectorAll('.work-card');

    gsap.from(this.label.nativeElement, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.worksSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    gsap.from(this.title.nativeElement, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.worksSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    cards.forEach((card: HTMLElement, index: number) => {
      const tl = gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
      if (tl.scrollTrigger) this.triggers.push(tl.scrollTrigger);
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

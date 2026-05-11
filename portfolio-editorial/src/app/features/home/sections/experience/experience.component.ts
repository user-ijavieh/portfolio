import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section class="experience-section" id="experience" #experienceSection>
      <div class="experience-header">
        <span class="section-label" #label>Experience</span>
        <h2 class="section-title" #title>Skills & Expertise</h2>
      </div>

      <div class="experience-content">
        <div class="experience-left" #left>
          <h3 class="subsection-title">Technical Stack</h3>
          <div class="skills-grid">
            @for (skill of technicalSkills; track skill) {
              <span class="skill-tag">{{ skill }}</span>
            }
          </div>
        </div>

        <div class="experience-right" #right>
          <h3 class="subsection-title">Career Path</h3>
          <div class="timeline">
            @for (item of timeline; track item.period) {
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <span class="timeline-period">{{ item.period }}</span>
                  <h4 class="timeline-role">{{ item.role }}</h4>
                  <p class="timeline-company">{{ item.company }}</p>
                  <p class="timeline-desc">{{ item.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience-section {
      padding: 10rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .experience-header {
      margin-bottom: 5rem;
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

    .experience-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 6rem;
    }

    .subsection-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--text-light);
      margin-bottom: 2.5rem;
      letter-spacing: -0.01em;
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      font-family: var(--font-main);
      font-size: 0.875rem;
      color: var(--text-muted);
      padding: 0.6rem 1.25rem;
      border: 1px solid var(--border-subtle);
      transition: all 0.3s ease;
      cursor: default;
    }

    .skill-tag:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-dim);
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: var(--border-subtle);
    }

    .timeline-item {
      display: flex;
      gap: 1.5rem;
      position: relative;
      padding-left: 2rem;
    }

    .timeline-marker {
      position: absolute;
      left: 0;
      top: 8px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 2px solid var(--accent);
      background: var(--bg-dark);
    }

    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .timeline-period {
      font-family: var(--font-main);
      font-size: 0.75rem;
      color: var(--accent);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .timeline-role {
      font-family: var(--font-display);
      font-size: 1.375rem;
      font-weight: 400;
      color: var(--text-light);
      letter-spacing: -0.01em;
    }

    .timeline-company {
      font-size: 0.9375rem;
      color: var(--text-muted);
    }

    .timeline-desc {
      font-size: 0.9375rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-top: 0.5rem;
      max-width: 50ch;
    }
  `]
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('experienceSection') experienceSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('left') left!: ElementRef;
  @ViewChild('right') right!: ElementRef;

  technicalSkills = [
    'Angular', 'TypeScript', 'GSAP', 'Three.js', 'WebGL',
    'SCSS', 'Tailwind CSS', 'Node.js', 'RxJS', 'NgRx',
    'Figma', 'Adobe Creative Suite', 'Blender', 'Shader Programming'
  ];

  timeline = [
    {
      period: '2023 — Present',
      role: 'Senior Creative Developer',
      company: 'Independent Studio',
      description: 'Leading creative development for premium brands and cultural institutions. Specializing in immersive web experiences and design systems.'
    },
    {
      period: '2021 — 2023',
      role: 'Frontend Engineer',
      company: 'Digital Agency',
      description: 'Built complex Angular applications with focus on animation, performance, and accessibility. Led a team of three developers.'
    },
    {
      period: '2019 — 2021',
      role: 'UI/UX Designer',
      company: 'Product Studio',
      description: 'Designed and prototyped digital products for startups. Bridged the gap between design vision and technical implementation.'
    }
  ];

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const elements = [
      this.label.nativeElement,
      this.title.nativeElement,
      this.left.nativeElement,
      this.right.nativeElement
    ];

    elements.forEach((el, i) => {
      const tl = gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.experienceSection.nativeElement,
          start: 'top 75%',
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

import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="about-section" id="about" #aboutSection>
      <div class="about-grid">
        <div class="about-left">
          <span class="section-label" #label>About</span>
          <h2 class="about-title" #title>
            Crafting digital<br>experiences with<br>purpose and precision
          </h2>
        </div>
        <div class="about-right">
          <div class="about-text" #text>
            <p>
              I am a creative developer and designer focused on building immersive web experiences 
              that merge editorial aesthetics with technical excellence. My work sits at the intersection 
              of visual design, motion, and frontend engineering.
            </p>
            <p>
              With a background in both design and development, I approach each project holistically — 
              considering not just how things look, but how they feel, move, and respond. I believe that 
              the best digital experiences are those that respect the user's attention while delivering 
              moments of genuine delight.
            </p>
            <p>
              Currently based in Madrid, I collaborate with studios, agencies, and ambitious brands 
              who value craft over trends and substance over noise.
            </p>
          </div>
          <div class="about-stats" #stats>
            <div class="stat">
              <span class="stat-number">6+</span>
              <span class="stat-label">Years Experience</span>
            </div>
            <div class="stat">
              <span class="stat-number">40+</span>
              <span class="stat-label">Projects Delivered</span>
            </div>
            <div class="stat">
              <span class="stat-number">12</span>
              <span class="stat-label">Awards Received</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 10rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 6rem;
      align-items: start;
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

    .about-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 400;
      line-height: 1.15;
      color: var(--text-light);
      letter-spacing: -0.02em;
    }

    .about-right {
      display: flex;
      flex-direction: column;
      gap: 4rem;
      padding-top: 2.5rem;
    }

    .about-text {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .about-text p {
      font-size: 1.0625rem;
      line-height: 1.8;
      color: var(--text-muted);
    }

    .about-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-subtle);
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-number {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 400;
      color: var(--text-light);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  `]
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('text') text!: ElementRef;
  @ViewChild('stats') stats!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const elements = [
      this.label.nativeElement,
      this.title.nativeElement,
      this.text.nativeElement,
      this.stats.nativeElement
    ];

    elements.forEach((el, i) => {
      const tl = gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.aboutSection.nativeElement,
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

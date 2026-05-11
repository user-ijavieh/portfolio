import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="portal-section" #portalSection>
      <div class="portal-content">
        <h1 class="portal-title" #title>
          <span class="line">Creative</span>
          <span class="line">Developer</span>
        </h1>
        <p class="portal-subtitle" #subtitle>Portfolio / 2025</p>
      </div>
      
      <svg class="portal-mask-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="portal-mask">
            <rect width="100" height="100" fill="white" />
            <circle #maskCircle cx="50" cy="50" r="8" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="var(--bg-dark)" mask="url(#portal-mask)" />
      </svg>

      <div class="portal-hint" #hint>
        <div class="hint-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  `,
  styles: [`
    .portal-section {
      position: relative;
      width: 100vw;
      height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: var(--bg-dark);
    }

    .portal-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .portal-title {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .portal-title .line {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 10vw, 9rem);
      font-weight: 300;
      line-height: 1.05;
      color: var(--text-light);
      letter-spacing: -0.03em;
    }

    .portal-subtitle {
      margin-top: 2rem;
      font-family: var(--font-main);
      font-size: 0.875rem;
      font-weight: 300;
      color: var(--text-muted);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .portal-mask-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
    }

    .portal-hint {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      opacity: 0.6;
    }

    .hint-line {
      width: 1px;
      height: 60px;
      background: linear-gradient(to bottom, var(--accent), transparent);
      animation: pulse 2s ease-in-out infinite;
    }

    .portal-hint span {
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scaleY(0.7); }
      50% { opacity: 1; transform: scaleY(1); }
    }
  `]
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('portalSection') portalSection!: ElementRef;
  @ViewChild('maskCircle') maskCircle!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('hint') hint!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.initEntranceAnimation();
    this.initPortalAnimation();
  }

  private initEntranceAnimation(): void {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(this.title.nativeElement.querySelectorAll('.line'), {
      y: 80,
      opacity: 0,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power3.out'
    })
    .from(this.subtitle.nativeElement, {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from(this.hint.nativeElement, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.5');
  }

  private initPortalAnimation(): void {
    const section = this.portalSection.nativeElement;
    const circle = this.maskCircle.nativeElement;
    const hint = this.hint.nativeElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1
      }
    });

    tl.to(circle, {
      attr: { r: 75 },
      ease: 'power2.inOut',
      duration: 1
    })
    .to(hint, {
      opacity: 0,
      duration: 0.2
    }, 0)
    .to(this.title.nativeElement, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3
    }, 0.7)
    .to(section, {
      opacity: 0,
      duration: 0.1
    }, 0.95);

    this.triggers.push(tl.scrollTrigger!);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

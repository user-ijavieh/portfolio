import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('textLayer') textLayer!: ElementRef;
  @ViewChild('imageLayer') imageLayer!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('stats') stats!: ElementRef;

  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
  }

  private initAnimations(): void {
    if (this.ctx) return;
    const section = this.aboutSection.nativeElement;

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reset'
        }
      });

      // 1. Architectural entry: text layer (clip-path reveal)
      tl.from(this.textLayer.nativeElement, {
        x: -60,
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.2,
        ease: 'power3.inOut'
      });

      // 2. Architectural entry: image (scale + slight rotation)
      tl.from(this.imageLayer.nativeElement, {
        scale: 0.8,
        rotation: 2,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, '-=0.9');

      // 3. Stagger Reveal: title words appear one by one
      if (this.title?.nativeElement) {
        const words = this.title.nativeElement.querySelectorAll('.word');
        if (words.length) {
          tl.from(words, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
          }, '-=0.8');
        }
      }

      // 4. Syntax Highlight: keywords light up
      const keywords = section.querySelectorAll('.keyword');
      if (keywords.length) {
        this.initSyntaxHighlight(Array.from(keywords) as HTMLElement[]);
      }

      // 5. Stagger Slide Up: stats rise from below
      if (this.stats?.nativeElement) {
        const statItems = this.stats.nativeElement.querySelectorAll('.stat-item');
        if (statItems.length) {
          this.initStaggerSlideUp(Array.from(statItems) as HTMLElement[]);
        }
      }

      // 6. Parallax on image
      const img = this.imageLayer.nativeElement.querySelector('img');
      if (img) {
        gsap.to(img, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    });
  }

  // ============================================
  // Stagger Reveal (title words)
  // ============================================
  private initStaggerReveal(words: HTMLElement[]): void {
    gsap.from(words, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.title.nativeElement,
        start: 'top 75%',
        toggleActions: 'play none none reset'
      }
    });
  }

  // ============================================
  // Syntax Highlight
  // ============================================
  private initSyntaxHighlight(elements: HTMLElement[]): void {
    elements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        onEnter: () => el.classList.add('highlighted'),
        onLeaveBack: () => el.classList.remove('highlighted')
      });
    });
  }

  // ============================================
  // Stagger Slide Up (stats)
  // ============================================
  private initStaggerSlideUp(items: HTMLElement[]): void {
    gsap.from(items, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.stats.nativeElement,
        start: 'top 82%',
        toggleActions: 'play none none reset'
      }
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

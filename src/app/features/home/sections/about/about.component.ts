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
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('body') body!: ElementRef;
  @ViewChild('image') image!: ElementRef;

  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
  }

  private initAnimations(): void {
    if (this.ctx) return;
    const section = this.aboutSection.nativeElement;

    this.ctx = gsap.context(() => {
      // Consolidated reveal: 1 trigger, sequential timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reset'
        }
      });

      tl.from(this.label.nativeElement, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from(this.title.nativeElement, { x: -40, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.4')
        .from(this.body.nativeElement, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .from(this.image.nativeElement, { scale: 1.08, opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=0.7');

      // Separate parallax (needs its own scrub trigger)
      const img = this.image.nativeElement.querySelector('img');
      if (img) {
        gsap.to(img, {
          y: -60,
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

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

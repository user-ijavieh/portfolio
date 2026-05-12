import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit {
  @Input() revealDelay: number = 0;
  @Input() revealY: number = 60;
  @Input() revealDuration: number = 1.2;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    gsap.from(this.el.nativeElement, {
      y: this.revealY,
      opacity: 0,
      duration: this.revealDuration,
      delay: this.revealDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
}

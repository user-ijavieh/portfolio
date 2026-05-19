import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('links') links!: ElementRef;

  private ctx: gsap.Context | null = null;
  private quickToX: ReturnType<typeof gsap.quickTo> | null = null;
  private quickToY: ReturnType<typeof gsap.quickTo> | null = null;
  private magneticCleanup: (() => void) | null = null;

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
    this.initMagneticEffect();
  }

  private initAnimations(): void {
    if (this.ctx) return;
    const section = this.contactSection.nativeElement;

    this.ctx = gsap.context(() => {
      const elements = [
        this.label.nativeElement,
        this.title.nativeElement,
        this.desc.nativeElement,
        this.email.nativeElement,
        this.links.nativeElement
      ];

      gsap.from(elements, {
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reset'
        }
      });
    });
  }

  private initMagneticEffect(): void {
    const el = this.email.nativeElement;
    const strength = 0.4;

    // Cache rect; update on resize instead of recalculating every mousemove
    let rect = el.getBoundingClientRect();
    const resizeObs = new ResizeObserver(() => { rect = el.getBoundingClientRect(); });
    resizeObs.observe(el);

    this.quickToX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    this.quickToY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMouseMove = (e: MouseEvent) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.quickToX!((e.clientX - centerX) * strength);
      this.quickToY!((e.clientY - centerY) * strength);
    };

    const onMouseLeave = () => {
      this.quickToX!(0);
      this.quickToY!(0);
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    this.magneticCleanup = () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      resizeObs.disconnect();
    };
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    this.magneticCleanup?.();
  }
}

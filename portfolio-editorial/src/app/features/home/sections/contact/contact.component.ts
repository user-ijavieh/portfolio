import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
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

  private triggers: ScrollTrigger[] = [];
  private quickToX: any;
  private quickToY: any;

  ngAfterViewInit(): void {
    const section = this.contactSection.nativeElement;

    // Reveal animations
    const elements = [
      this.label.nativeElement,
      this.title.nativeElement,
      this.desc.nativeElement,
      this.email.nativeElement,
      this.links.nativeElement
    ];

    elements.forEach((el, i) => {
      const tl = gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
      if (tl.scrollTrigger) this.triggers.push(tl.scrollTrigger);
    });

    // Magnetic email effect
    this.initMagneticEffect();
  }

  private initMagneticEffect(): void {
    const el = this.email.nativeElement;
    const strength = 0.4;

    this.quickToX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    this.quickToY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;
      this.quickToX(distX);
      this.quickToY(distY);
    });

    el.addEventListener('mouseleave', () => {
      this.quickToX(0);
      this.quickToY(0);
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

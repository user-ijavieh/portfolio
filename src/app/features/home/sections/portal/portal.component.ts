import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('portalSection') portalSection!: ElementRef;
  @ViewChild('maskCircle') maskCircle!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('hint') hint!: ElementRef;
  @ViewChild('bgImage') bgImage!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.initEntranceAnimation();
    this.initPortalAnimation();
  }

  private initEntranceAnimation(): void {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(this.title.nativeElement.querySelectorAll('.line'), {
      y: 100,
      opacity: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: 'power3.out'
    })
    .from(this.subtitle.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1')
    .from(this.hint.nativeElement, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=0.6');
  }

  private initPortalAnimation(): void {
    const section = this.portalSection.nativeElement;
    const circle = this.maskCircle.nativeElement;
    const hint = this.hint.nativeElement;
    const bgImage = this.bgImage.nativeElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1.2
      }
    });

    // Phase 1: Mask expands revealing background image
    tl.to(circle, {
      attr: { r: 80 },
      ease: 'power2.inOut',
      duration: 1
    })
    // Phase 2: Background image scales subtly for depth
    .to(bgImage, {
      scale: 1.15,
      ease: 'none',
      duration: 1
    }, 0)
    // Phase 3: Text fades early
    .to(this.title.nativeElement, {
      opacity: 0,
      y: -40,
      duration: 0.3
    }, 0.5)
    .to(this.subtitle.nativeElement, {
      opacity: 0,
      duration: 0.2
    }, 0.55)
    .to(hint, {
      opacity: 0,
      duration: 0.1
    }, 0)
    // Phase 4: Entire section fades out at the very end
    .to(section, {
      opacity: 0,
      duration: 0.08
    }, 0.92);

    this.triggers.push(tl.scrollTrigger!);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

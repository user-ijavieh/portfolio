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

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const section = this.aboutSection.nativeElement;

    // Label fade up
    const labelTl = gsap.from(this.label.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' }
    });
    if (labelTl.scrollTrigger) this.triggers.push(labelTl.scrollTrigger);

    // Title fade left (asymmetric tension)
    const titleTl = gsap.from(this.title.nativeElement, {
      x: -60,
      opacity: 0,
      duration: 1.4,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    });
    if (titleTl.scrollTrigger) this.triggers.push(titleTl.scrollTrigger);

    // Body fade up
    const bodyTl = gsap.from(this.body.nativeElement, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      delay: 0.25,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
    });
    if (bodyTl.scrollTrigger) this.triggers.push(bodyTl.scrollTrigger);

    // Image scale-in with parallax
    const imageTl = gsap.from(this.image.nativeElement, {
      scale: 1.1,
      opacity: 0,
      duration: 1.6,
      delay: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
    });
    if (imageTl.scrollTrigger) this.triggers.push(imageTl.scrollTrigger);

    // Subtle parallax on image
    const parallax = gsap.to(this.image.nativeElement.querySelector('img'), {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
    if (parallax.scrollTrigger) this.triggers.push(parallax.scrollTrigger);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

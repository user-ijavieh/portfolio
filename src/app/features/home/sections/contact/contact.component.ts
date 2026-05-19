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

  ngAfterViewInit(): void {
    document.addEventListener('st:ready', () => this.initAnimations(), { once: true });
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

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

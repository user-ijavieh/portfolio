import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navEl') navEl!: ElementRef;

  isVisible = false;
  private scrollTrigger?: ScrollTrigger;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initVisibilityTrigger();
  }

  private initVisibilityTrigger(): void {
    // Show nav after scrolling past the viewport height (portal section)
    this.scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: '100vh top',
      onEnter: () => this.showNav(),
      onLeaveBack: () => this.hideNav()
    });
  }

  private showNav(): void {
    this.isVisible = true;
    gsap.to(this.navEl.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  private hideNav(): void {
    this.isVisible = false;
    gsap.to(this.navEl.nativeElement, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in'
    });
  }

  scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 40 },
        ease: 'power3.inOut'
      });
    }
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }
}

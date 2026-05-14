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
    // Wait for portal interaction before showing nav
    document.addEventListener('portal:entered', () => {
      this.showNav();
    }, { once: true });

    // Defer until portal pin layout is calculated so trigger position is accurate
    requestAnimationFrame(() => {
      this.initVisibilityTrigger();
    });
  }

  private initVisibilityTrigger(): void {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;

    // Toggle nav background when scrolling past the portal
    this.scrollTrigger = ScrollTrigger.create({
      trigger: contentWrapper,
      start: 'top top',
      onEnter: () => this.navEl?.nativeElement.classList.add('scrolled'),
      onLeaveBack: () => this.navEl?.nativeElement.classList.remove('scrolled')
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

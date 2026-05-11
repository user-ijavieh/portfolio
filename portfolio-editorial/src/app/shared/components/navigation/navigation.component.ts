import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav" [class.visible]="isVisible">
      <div class="nav-brand">Portfolio</div>
      <ul class="nav-links">
        <li><a href="#works" (click)="scrollTo($event, 'works')">Works</a></li>
        <li><a href="#about" (click)="scrollTo($event, 'about')">About</a></li>
        <li><a href="#experience" (click)="scrollTo($event, 'experience')">Experience</a></li>
        <li><a href="#contact" (click)="scrollTo($event, 'contact')">Contact</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 3rem;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
      pointer-events: none;
    }

    .nav.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    .nav-brand {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--text-light);
      letter-spacing: -0.02em;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2.5rem;
    }

    .nav-links a {
      font-family: var(--font-main);
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--text-muted);
      letter-spacing: 0.02em;
      transition: color 0.3s ease;
      position: relative;
    }

    .nav-links a:hover {
      color: var(--text-light);
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--accent);
      transition: width 0.3s ease;
    }

    .nav-links a:hover::after {
      width: 100%;
    }
  `]
})
export class NavigationComponent implements OnInit, OnDestroy {
  isVisible = false;
  private scrollThreshold = window.innerHeight * 1.5;

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isVisible = window.scrollY > this.scrollThreshold;
  }

  scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut'
      });
    }
  }

  ngOnDestroy(): void {}
}

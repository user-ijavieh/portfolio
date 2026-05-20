import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navEl') navEl!: ElementRef;

  isVisible = true;
  menuOpen = false;
  private scrollTrigger?: ScrollTrigger;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Nav is always visible and clickable from the start
    requestAnimationFrame(() => {
      this.initVisibilityTrigger();
    });
  }

  private initVisibilityTrigger(): void {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    // Toggle nav background when page content enters the viewport
    this.scrollTrigger = ScrollTrigger.create({
      trigger: pageContent,
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    this.closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 40 },
        ease: 'power3.inOut'
      });
    }
  }

  scrollToTop(): void {
    this.closeMenu();
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: 0 },
      ease: 'power3.inOut'
    });
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }
}

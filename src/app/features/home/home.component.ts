import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NavigationComponent } from '../../shared/components/navigation/navigation.component';

import { PortalComponent } from './sections/portal/portal.component';
import { WorksComponent } from './sections/works/works.component';
import { AboutComponent } from './sections/about/about.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ContactComponent } from './sections/contact/contact.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    PortalComponent,
    WorksComponent,
    AboutComponent,
    ExperienceComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('homeContainer') homeContainer!: ElementRef;
  @ViewChild('heroStage') heroStage!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initHeroSequence();
    });
  }

  private initHeroSequence(): void {
    const heroStage = this.heroStage.nativeElement;

    const chromaCanvas = heroStage.querySelector('.portal-chroma-canvas') as HTMLElement;
    const bgImage = heroStage.querySelector('.portal-bg') as HTMLElement;
    const hint = heroStage.querySelector('.portal-hint') as HTMLElement;
    const title = heroStage.querySelector('.portal-title') as HTMLElement;
    const scrollInd = heroStage.querySelector('.portal-scroll-wrap') as HTMLElement;
    const portalSection = heroStage.querySelector('.portal-section') as HTMLElement;

    const bgText = heroStage.querySelector('.portal-bg-text') as HTMLElement;
    const bgTextLine1 = heroStage.querySelector('.bg-text-line1') as HTMLElement;
    const bgTextLine2 = heroStage.querySelector('.bg-text-line2') as HTMLElement;
    const bgTextConnector = heroStage.querySelector('.bg-text-connector') as HTMLElement;
    const bgTextBody = heroStage.querySelector('.bg-text-body') as HTMLElement;
    const bgTextCta = heroStage.querySelector('.bg-text-cta') as HTMLElement;
    const bgTextMeta = heroStage.querySelector('.bg-text-meta') as HTMLElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroStage,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        fastScrollEnd: true,
        snap: {
          snapTo: (progress: number) => {
            if (progress > 0.55) return 1;
            if (progress < 0.45) return progress;
            return progress > 0.5 ? 1 : progress;
          },
          duration: { min: 0.4, max: 1.0 },
          delay: 0,
          ease: 'power2.inOut'
        }
      }
    });

    /* ── Phase 1: Immersive zoom through portal (0% - 40%) ── */
    if (chromaCanvas) {
      tl.fromTo(chromaCanvas,
        { scale: 1, transformOrigin: 'center center' },
        { scale: 40, ease: 'power3.inOut', duration: 0.4 },
        0
      );
    }
    if (bgImage) {
      tl.fromTo(bgImage,
        { scale: 1 },
        { scale: 1.08, ease: 'power1.in', duration: 0.8 },
        0
      );
    }
    if (hint) {
      tl.fromTo(hint,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.inOut', duration: 0.15 },
        0
      );
    }
    if (title) {
      tl.fromTo(title,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -30, ease: 'power2.inOut', duration: 0.15 },
        0
      );
    }
    if (scrollInd) {
      tl.fromTo(scrollInd,
        { opacity: 1, y: 0 },
        { opacity: 0, y: 20, ease: 'power2.inOut', duration: 0.15 },
        0
      );
    }

    /* ── Phase 2: Hold on wallpaper (40% - 65%) ── */
    /* Contenedor wallpaper-2 aparece */
    if (bgText) {
      tl.fromTo(bgText,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.05 },
        0.25
      );
    }

    /* Textos de wallpaper-2 aparecen más temprano y duran más */
    if (bgTextLine1) {
      tl.fromTo(bgTextLine1,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.28
      );
    }
    if (bgTextLine2) {
      tl.fromTo(bgTextLine2,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.30
      );
    }
    if (bgTextConnector) {
      tl.fromTo(bgTextConnector,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.10 },
        0.32
      );
    }
    if (bgTextBody) {
      tl.fromTo(bgTextBody,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 },
        0.34
      );
    }
    if (bgTextCta) {
      tl.fromTo(bgTextCta,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.10 },
        0.36
      );
    }
    if (bgTextMeta) {
      tl.fromTo(bgTextMeta,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', duration: 0.08 },
        0.38
      );
    }

    /* Textos de wallpaper-2 desaparecen más tarde, justo antes de la fase 3 */
    if (bgText) {
      tl.fromTo(bgText,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.inOut', duration: 0.10 },
        0.60
      );
    }

    /* ── Phase 3: Hero exits, content revealed (65% - 100%) ── */
    if (portalSection) {
      tl.fromTo(portalSection,
        { opacity: 1, x: 0 },
        { opacity: 0, x: '-15vw', ease: 'power2.inOut', duration: 0.35 },
        0.65
      );
    }

    this.triggers.push(tl.scrollTrigger!);

    // Refresh all positions with the pin spacer now established,
    // then signal child sections that they can safely init their triggers
    ScrollTrigger.refresh();
    document.dispatchEvent(new CustomEvent('st:ready'));
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

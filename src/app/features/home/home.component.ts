import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
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
    FooterComponent,
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
  @ViewChild('wipeStage') wipeStage!: ElementRef;
  @ViewChild('wipePortal') wipePortal!: ElementRef;
  @ViewChild('wipeContent') wipeContent!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initScrollSequence();
    });
  }

  private initScrollSequence(): void {
    const wipeStage = this.wipeStage.nativeElement;
    const wipePortal = this.wipePortal.nativeElement;
    const wipeContent = this.wipeContent.nativeElement;

    // Query portal elements directly
    const chromaCanvas = wipePortal.querySelector('.portal-chroma-canvas') as HTMLElement;
    const bgImage = wipePortal.querySelector('.portal-bg') as HTMLElement;
    const hint = wipePortal.querySelector('.portal-hint') as HTMLElement;
    const title = wipePortal.querySelector('.portal-title') as HTMLElement;
    const scrollInd = wipePortal.querySelector('.portal-scroll-wrap') as HTMLElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wipeStage,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        fastScrollEnd: true,
        onLeave: () => ScrollTrigger.refresh(),
        snap: {
          snapTo: (progress: number) => {
            // If user has entered wipe zone, force completion
            if (progress > 0.58) return 1;
            // If user scrolls back before wipe, stay free
            if (progress < 0.5) return progress;
            // Transition zone: snap to nearest extreme
            return progress > 0.54 ? 1 : progress;
          },
          duration: { min: 0.4, max: 1.2 },
          delay: 0,
          ease: 'power2.inOut'
        }
      }
    });

    /* ── Phase 1: Pass through the portal ── */
    if (chromaCanvas) {
      tl.fromTo(chromaCanvas,
        { scale: 1, transformOrigin: 'center center' },
        { scale: 40, ease: 'power2.inOut', duration: 0.5 },
        0
      );
    }
    if (bgImage) {
      tl.fromTo(bgImage,
        { scale: 1 },
        { scale: 1.15, ease: 'none', duration: 1 },
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

    /* ── Phase 2: Hold ── */
    // (empty gap so wallpaper-2 is fully visible)

    /* ── Phase 3: Horizontal wipe ── */
    tl.fromTo(wipePortal,
      { x: 0 },
      { x: '-25vw', ease: 'power2.inOut', duration: 0.8 },
      '+=0.5'
    );

    tl.fromTo(wipeContent,
      { x: '100vw' },
      { x: 0, ease: 'power2.inOut', duration: 0.8 },
      '<'
    );

    this.triggers.push(tl.scrollTrigger!);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

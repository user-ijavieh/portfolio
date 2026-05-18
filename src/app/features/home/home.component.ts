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
  @ViewChild(PortalComponent) portalComponent!: PortalComponent;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initHorizontalWipe();
    });
  }

  private initHorizontalWipe(): void {
    const wipeStage = this.wipeStage.nativeElement;
    const wipePortal = this.wipePortal.nativeElement;
    const wipeContent = this.wipeContent.nativeElement;
    const p = this.portalComponent.getAnimationTargets();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wipeStage,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 2.5,
        anticipatePin: 1,
        onLeave: () => ScrollTrigger.refresh()
      }
    });

    /* ── Phase 1: Pass through the portal ── */
    if (p.chromaCanvas) {
      tl.fromTo(p.chromaCanvas,
        { scale: 1, transformOrigin: 'center center' },
        { scale: 40, ease: 'power2.inOut', duration: 0.5 },
        0
      );
    }
    if (p.bgImage) {
      tl.to(p.bgImage, { scale: 1.15, ease: 'none', duration: 1 }, 0);
    }
    if (p.hint) {
      tl.to(p.hint, { opacity: 0, duration: 0.1 }, 0);
    }
    if (p.title) {
      tl.to(p.title, { opacity: 0, y: -30, ease: 'power2.in', duration: 0.2 }, 0);
    }
    if (p.scrollInd) {
      tl.to(p.scrollInd, { opacity: 0, y: 20, ease: 'power2.in', duration: 0.15 }, 0);
    }

    /* ── Phase 2: Hold ── */
    // (empty gap so wallpaper-2 is fully visible before wipe starts)

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

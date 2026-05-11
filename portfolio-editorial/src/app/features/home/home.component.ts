import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PortalComponent } from './sections/portal/portal.component';
import { WorksComponent } from './sections/works/works.component';
import { AboutComponent } from './sections/about/about.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ContactComponent } from './sections/contact/contact.component';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
  template: `
    <app-navigation />
    
    <main class="home-container" #homeContainer>
      <app-portal />
      
      <div class="content-wrapper" #contentWrapper>
        <app-works />
        <app-about />
        <app-experience />
        <app-contact />
        <app-footer />
      </div>
    </main>
  `,
  styles: [`
    .home-container {
      position: relative;
      background: var(--bg-dark);
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
      background: var(--bg-dark);
      will-change: transform;
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('homeContainer') homeContainer!: ElementRef;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.initTransitionAnimation();
  }

  private initTransitionAnimation(): void {
    const content = this.contentWrapper.nativeElement;

    const st = ScrollTrigger.create({
      trigger: content,
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1,
      animation: gsap.from(content, {
        x: '100vw',
        ease: 'power2.inOut'
      })
    });

    this.triggers.push(st);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

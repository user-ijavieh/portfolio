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
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    // Delay to ensure portal ScrollTrigger is initialized first
    requestAnimationFrame(() => {
      this.initContentEntrance();
    });
  }

  private initContentEntrance(): void {
    const content = this.contentWrapper.nativeElement;

    // Slide content in from right as user scrolls past portal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: content,
        start: 'top 95%',
        end: 'top 40%',
        scrub: 1.5,
      }
    });

    tl.fromTo(content,
      { x: '60vw', opacity: 0.5 },
      { x: 0, opacity: 1, ease: 'power2.out' }
    );

    this.triggers.push(tl.scrollTrigger!);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DataService } from '../../../../core/services/data.service';
import { Project } from '../../../../core/models/project.model';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './works.component.html',
  styleUrl: './works.component.scss'
})
export class WorksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('worksSection') worksSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('grid') grid!: ElementRef;

  projects: Project[] = [];
  private triggers: ScrollTrigger[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.projects = this.dataService.getProjects();
  }

  ngAfterViewInit(): void {
    this.initRevealAnimations();
  }

  private initRevealAnimations(): void {
    // Header reveal
    gsap.from(this.header.nativeElement.children, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.worksSection.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Cards: clip-path reveal for images, fade-up for meta
    const cards = this.grid.nativeElement.querySelectorAll('.work-card');
    cards.forEach((card: HTMLElement, index: number) => {
      const image = card.querySelector('.work-image') as HTMLElement;
      const meta = card.querySelector('.work-meta') as HTMLElement;

      // Image clip-path reveal
      const imgTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      imgTl.from(image, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        delay: index * 0.08,
        ease: 'power3.inOut'
      })
      .from(meta, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');

      if (imgTl.scrollTrigger) this.triggers.push(imgTl.scrollTrigger);
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

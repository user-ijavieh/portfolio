import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('experienceSection') experienceSection!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('skillsList') skillsList!: ElementRef;
  @ViewChild('timeline') timeline!: ElementRef;

  technicalSkills = [
    'Angular', 'TypeScript', 'GSAP', 'Three.js', 'WebGL',
    'SCSS', 'Tailwind CSS', 'Node.js', 'RxJS',
    'Figma', 'Blender', 'GLSL'
  ];

  timelineItems = [
    {
      period: '2023 — Present',
      role: 'Senior Creative Developer',
      context: 'Independent'
    },
    {
      period: '2021 — 2023',
      role: 'Frontend Engineer',
      context: 'Digital Agency'
    },
    {
      period: '2019 — 2021',
      role: 'UI Designer',
      context: 'Product Studio'
    }
  ];

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const section = this.experienceSection.nativeElement;

    // Header reveal
    gsap.from(this.header.nativeElement.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Skills stagger
    const skillEls = this.skillsList.nativeElement.querySelectorAll('.skill-item');
    const skillsTl = gsap.from(skillEls, {
      x: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.skillsList.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    if (skillsTl.scrollTrigger) this.triggers.push(skillsTl.scrollTrigger);

    // Timeline line draw
    const line = this.timeline.nativeElement.querySelector('.timeline-line');
    const items = this.timeline.nativeElement.querySelectorAll('.timeline-item');

    const tlTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.timeline.nativeElement,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    tlTl.from(line, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.2,
      ease: 'power2.out'
    })
    .from(items, {
      x: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.8');

    if (tlTl.scrollTrigger) this.triggers.push(tlTl.scrollTrigger);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

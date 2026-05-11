import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section class="contact-section" id="contact" #contactSection>
      <div class="contact-content">
        <span class="section-label" #label>Contact</span>
        <h2 class="contact-title" #title>
          Let's create<br>something<br>remarkable
        </h2>
        <p class="contact-desc" #desc>
          Open to collaborations, freelance projects, and creative partnerships. 
          If you have an idea that demands craft and attention, I'd love to hear about it.
        </p>
        <div class="contact-links" #links>
          <a href="mailto:hello@portfolio.com" class="contact-link primary">
            <span>hello@portfolio.com</span>
          </a>
          <div class="social-links">
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">GitHub</a>
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">Dribbble</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      padding: 12rem 3rem 8rem;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 80dvh;
      display: flex;
      align-items: center;
    }

    .contact-content {
      max-width: 800px;
    }

    .section-label {
      display: block;
      font-family: var(--font-main);
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--accent);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .contact-title {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 400;
      line-height: 1.1;
      color: var(--text-light);
      letter-spacing: -0.03em;
      margin-bottom: 2rem;
    }

    .contact-desc {
      font-size: 1.125rem;
      line-height: 1.8;
      color: var(--text-muted);
      margin-bottom: 3rem;
      max-width: 55ch;
    }

    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .contact-link.primary {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      color: var(--text-light);
      position: relative;
      display: inline-block;
      transition: color 0.3s ease;
    }

    .contact-link.primary::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--accent);
      transform: scaleX(1);
      transform-origin: left;
      transition: transform 0.5s ease;
    }

    .contact-link.primary:hover {
      color: var(--accent);
    }

    .contact-link.primary:hover::after {
      transform: scaleX(0);
      transform-origin: right;
    }

    .social-links {
      display: flex;
      gap: 2rem;
    }

    .social-link {
      font-size: 0.9375rem;
      color: var(--text-muted);
      transition: color 0.3s ease;
      position: relative;
    }

    .social-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--accent);
      transition: width 0.3s ease;
    }

    .social-link:hover {
      color: var(--text-light);
    }

    .social-link:hover::after {
      width: 100%;
    }
  `]
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('label') label!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('links') links!: ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    const elements = [
      this.label.nativeElement,
      this.title.nativeElement,
      this.desc.nativeElement,
      this.links.nativeElement
    ];

    elements.forEach((el, i) => {
      const tl = gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.contactSection.nativeElement,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
      if (tl.scrollTrigger) this.triggers.push(tl.scrollTrigger);
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

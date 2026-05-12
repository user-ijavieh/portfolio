import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealVariant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'clipReveal' | 'staggerChildren';

export interface RevealOptions {
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  y?: number;
  x?: number;
  start?: string;
  ease?: string;
  stagger?: number;
  childSelector?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private triggers: ScrollTrigger[] = [];

  reveal(
    element: HTMLElement | HTMLElement[],
    options: RevealOptions = {}
  ): gsap.core.Tween | gsap.core.Timeline | undefined {
    const {
      variant = 'fadeUp',
      duration = 1.2,
      delay = 0,
      y = 60,
      x = 0,
      start = 'top 80%',
      ease = 'power3.out',
      stagger = 0.1,
      childSelector
    } = options;

    const targets = Array.isArray(element) ? element : [element];
    const trigger = targets[0];

    let animation: gsap.core.Tween | gsap.core.Timeline;

    switch (variant) {
      case 'fadeUp':
        animation = gsap.from(targets, {
          y: y,
          opacity: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      case 'fadeLeft':
        animation = gsap.from(targets, {
          x: -x || -80,
          opacity: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      case 'fadeRight':
        animation = gsap.from(targets, {
          x: x || 80,
          opacity: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      case 'scaleIn':
        animation = gsap.from(targets, {
          scale: 0.92,
          opacity: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      case 'clipReveal':
        targets.forEach((el) => {
          gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
        });
        animation = gsap.to(targets, {
          clipPath: 'inset(0% 0 0 0)',
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      case 'staggerChildren':
        const children = childSelector
          ? trigger.querySelectorAll(childSelector)
          : trigger.children;
        animation = gsap.from(children, {
          y: y,
          opacity: 0,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
        break;

      default:
        animation = gsap.from(targets, {
          y: y,
          opacity: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger,
            start,
            toggleActions: 'play none none none'
          }
        });
    }

    if (animation.scrollTrigger) {
      this.triggers.push(animation.scrollTrigger);
    }

    return animation;
  }

  parallax(element: HTMLElement, speed: number = 0.3): ScrollTrigger {
    const st = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      animation: gsap.to(element, { y: -speed * 200, ease: 'none' })
    });
    this.triggers.push(st);
    return st;
  }

  createScrollTrigger(config: ScrollTrigger.Vars): ScrollTrigger {
    const st = ScrollTrigger.create(config);
    this.triggers.push(st);
    return st;
  }

  killAll(): void {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
  }

  removeTrigger(trigger: ScrollTrigger): void {
    trigger.kill();
    this.triggers = this.triggers.filter(t => t !== trigger);
  }
}

import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private projects: Project[] = [
    {
      id: '01',
      title: 'Aether',
      category: 'Brand Identity',
      year: '2024',
      description: 'Visual system for an architecture studio focused on sustainable materials and negative space.',
      image: 'https://picsum.photos/seed/aether/800/1000',
      tags: ['Branding', 'Typography', 'Print']
    },
    {
      id: '02',
      title: 'Nocturne',
      category: 'Web Design',
      year: '2024',
      description: 'Immersive editorial platform for long-form journalism with cinematic scroll experiences.',
      image: 'https://picsum.photos/seed/nocturne/900/700',
      tags: ['UI/UX', 'GSAP', 'Editorial']
    },
    {
      id: '03',
      title: 'Solstice',
      category: 'Art Direction',
      year: '2023',
      description: 'Campaign visuals for a fragrance house exploring light, shadow, and material texture.',
      image: 'https://picsum.photos/seed/solstice/700/900',
      tags: ['Art Direction', 'Photography', 'Campaign']
    },
    {
      id: '04',
      title: 'Velum',
      category: 'Digital Product',
      year: '2023',
      description: 'Privacy-first messaging interface with gestural interactions and ephemeral design.',
      image: 'https://picsum.photos/seed/velum/800/600',
      tags: ['Product Design', 'Motion', 'Privacy']
    },
    {
      id: '05',
      title: 'Kairos',
      category: 'Exhibition',
      year: '2023',
      description: 'Spatial design and digital installations for a contemporary art museum retrospective.',
      image: 'https://picsum.photos/seed/kairos/600/800',
      tags: ['Spatial', 'Installation', 'Interactive']
    },
    {
      id: '06',
      title: 'Oblique',
      category: 'Editorial',
      year: '2022',
      description: 'Independent magazine redesign challenging conventional grid systems and reading rhythms.',
      image: 'https://picsum.photos/seed/oblique/900/800',
      tags: ['Editorial', 'Typography', 'Grid']
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}

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
      category: 'Identidad de marca',
      year: '2024',
      description: 'Sistema visual para un estudio de arquitectura enfocado en materiales sostenibles y el espacio negativo.',
      image: 'https://picsum.photos/seed/aether/800/1000',
      tags: ['Branding', 'Tipografía', 'Print']
    },
    {
      id: '02',
      title: 'Nocturne',
      category: 'Diseño web',
      year: '2024',
      description: 'Plataforma editorial inmersiva para periodismo de largo formato con experiencias de scroll cinematográficas.',
      image: 'https://picsum.photos/seed/nocturne/900/700',
      tags: ['UI/UX', 'GSAP', 'Editorial']
    },
    {
      id: '03',
      title: 'Solstice',
      category: 'Dirección de arte',
      year: '2023',
      description: 'Visuales de campaña para una casa de fragancias que explora la luz, la sombra y la textura material.',
      image: 'https://picsum.photos/seed/solstice/700/900',
      tags: ['Dirección de arte', 'Fotografía', 'Campaña']
    },
    {
      id: '04',
      title: 'Velum',
      category: 'Producto digital',
      year: '2023',
      description: 'Interfaz de mensajería con privacidad como prioridad, interacciones gestuales y diseño efímero.',
      image: 'https://picsum.photos/seed/velum/800/600',
      tags: ['Diseño de producto', 'Motion', 'Privacidad']
    },
    {
      id: '05',
      title: 'Kairos',
      category: 'Exhibición',
      year: '2023',
      description: 'Diseño espacial e instalaciones digitales para una retrospectiva en un museo de arte contemporáneo.',
      image: 'https://picsum.photos/seed/kairos/600/800',
      tags: ['Espacial', 'Instalación', 'Interactivo']
    },
    {
      id: '06',
      title: 'Oblique',
      category: 'Editorial',
      year: '2022',
      description: 'Rediseño de una revista independiente que desafía los sistemas de grid convencionales y los ritmos de lectura.',
      image: 'https://picsum.photos/seed/oblique/900/800',
      tags: ['Editorial', 'Tipografía', 'Grid']
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}

import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private projects: Project[] = [
    {
      id: '01',
      title: 'SmartEconomato',
      category: 'ERP Full-Stack',
      year: '2025',
      description: 'Sistema integral de gestión para economato escolar. Inventarios en tiempo real, pedidos, planificación semanal, predicciones con IA y ledger criptográfico.',
      image: '/images/projects/SmartEconomato.jpeg'
    },
    {
      id: '02',
      title: 'Rutas Dinámicas',
      category: 'Optimización logística',
      year: '2025',
      description: 'Generación inteligente de rutas empresariales mediante IA y conectores MCP. Visualización cartográfica con soporte para Canarias y Baleares.',
      image: '/images/projects/RutasDinamicas.jpeg'
    },
    {
      id: '03',
      title: 'Asistente Virtual',
      category: 'Inteligencia artificial',
      year: '2025',
      description: 'Asistente conversacional empresarial con capacidad de razonamiento sobre datos internos mediante conectores MCP personalizados.',
      image: '/images/projects/AsistenteVirtual.jpeg'
    },
    {
      id: '04',
      title: 'Gestión de Cocina IA',
      category: 'Automatización de procesos',
      year: '2024',
      description: 'Flujo completo de restaurante con chatbot para pedidos y tablero Kanban en tiempo real para gestión de estados en cocina.',
      image: '/images/projects/kanban.webp'
    },
    {
      id: '05',
      title: 'PokeApi',
      category: 'Frontend',
      year: '2024',
      description: 'Aplicación interactiva para explorar datos de Pokémon. Primer proyecto con Angular, enfocado en el consumo de APIs REST y patrones de estado.',
      image: '/images/projects/PokeApi.jpeg'
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}

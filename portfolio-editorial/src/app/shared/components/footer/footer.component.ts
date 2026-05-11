import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Designed & Built with precision</p>
        <p class="footer-year">2025</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 4rem 3rem;
      border-top: 1px solid var(--border-subtle);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-text {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .footer-year {
      font-family: var(--font-display);
      font-size: 1.25rem;
      color: var(--text-muted);
    }
  `]
})
export class FooterComponent {}

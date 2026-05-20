import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type PortalState = 'loading' | 'needsInteraction' | 'ready';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('portalSection') portalSection!: ElementRef;
  @ViewChild('hint') hint!: ElementRef;
  @ViewChild('bgImage') bgImage!: ElementRef;
  @ViewChild('chromaCanvas') chromaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chromaVideo') chromaVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('loader') loader!: ElementRef;
  @ViewChild('interactionHint') interactionHint!: ElementRef;
  @ViewChild('portalTitle') portalTitle!: ElementRef;
  @ViewChild('titleSmall') titleSmall!: ElementRef;
  @ViewChild('titleLeft') titleLeft!: ElementRef;
  @ViewChild('titleAmp') titleAmp!: ElementRef;
  @ViewChild('titleRight') titleRight!: ElementRef;
  @ViewChild('portalYear') portalYear!: ElementRef;
  @ViewChild('typewriterText') typewriterText!: ElementRef;
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;

  portalState: PortalState = 'loading';

  private triggers: ScrollTrigger[] = [];
  private entranceTl: gsap.core.Timeline | null = null;
  private autoplayRetryCleanup: (() => void) | null = null;
  private isDestroyed = false;
  private chromaFramesRendered = 0;

  // Typewriter state
  private readonly typewriterString = 'Toca para entrar';
  private typewriterIndex = 0;
  private typewriterDirection: 'writing' | 'deleting' = 'writing';
  private typewriterTimeout: ReturnType<typeof setTimeout> | null = null;

  // Particle system
  private particleCtx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private particleRafId: number | null = null;
  private readonly particleSymbols = ['{ }', '< >', ';', '/', '*', '( )', '[ ]'];
  private readonly particleCount = 40;
  private easterEggImg: HTMLImageElement | null = null;
  private readonly easterEggChance = 0.05; // 5% probability

  // WebGL resources
  private gl: WebGLRenderingContext | null = null;
  private chromaRafId: number | null = null;
  private chromaProgram: WebGLProgram | null = null;
  private chromaTexture: WebGLTexture | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private uvBuffer: WebGLBuffer | null = null;
  private aPositionLoc: number = -1;
  private aUvLoc: number = -1;
  private uVideoLoc: WebGLUniformLocation | null = null;
  private onContextLost: ((e: Event) => void) | null = null;
  private onContextRestored: (() => void) | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.startTypewriter();
    this.initParticles();

    const bgVideo = this.bgVideo.nativeElement;
    const chromaVideo = this.chromaVideo.nativeElement;

    // Wait for both videos to have loaded their first frame, then start everything
    Promise.all([
      this.whenLoadedData(bgVideo),
      this.whenLoadedData(chromaVideo)
    ]).then(() => {
      if (this.isDestroyed) return;

      // Try autoplay immediately — videos are muted so this usually works
      Promise.allSettled([
        bgVideo.play(),
        chromaVideo.play()
      ]).then((results) => {
        if (this.isDestroyed) return;

        const anyBlocked = results.some(r =>
          r.status === 'rejected' && (r.reason as any)?.name === 'NotAllowedError'
        );

        if (anyBlocked) {
          // Browser blocked autoplay — show hint and wait for interaction
          this.portalState = 'needsInteraction';
          this.portalSection?.nativeElement.classList.add('needs-interaction');
          this.registerInteractionRetry();
        } else {
          // Autoplay worked — start WebGL immediately, keep loader visible
          this.initWebGLChroma();
          this.portalState = 'needsInteraction';
          this.portalSection?.nativeElement.classList.add('needs-interaction');
          this.registerRevealOnly();
        }
      });
    });
  }

  private whenLoadedData(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve) => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve();
        return;
      }
      const onReady = () => resolve();
      const onErr = () => resolve();
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('error', onErr, { once: true });
    });
  }

  private whenPlaying(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve) => {
      if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve();
        return;
      }
      const onPlaying = () => resolve();
      const onErr = () => resolve();
      video.addEventListener('playing', onPlaying, { once: true });
      video.addEventListener('error', onErr, { once: true });
    });
  }

  private ensureAutoplay(video: HTMLVideoElement): Promise<void> {
    return video.play().catch((err: any) => {
      if (err?.name === 'NotSupportedError') {
        console.warn('Autoplay not supported for this video format:', video.currentSrc || 'unknown source');
      }
      throw err;
    });
  }

  private registerInteractionRetry(): void {
    const retry = () => {
      if (this.portalState !== 'needsInteraction' || this.isDestroyed) return;

      // Videos weren't autoplaying — start them now, then init WebGL and reveal
      Promise.all([
        this.bgVideo?.nativeElement.play().catch(() => {}),
        this.chromaVideo?.nativeElement.play().catch(() => {})
      ]).then(() => {
        if (this.isDestroyed) return;
        Promise.all([
          this.whenPlaying(this.bgVideo.nativeElement),
          this.whenPlaying(this.chromaVideo.nativeElement)
        ]).then(() => {
          if (this.isDestroyed) return;
          this.setReady();
        });
      });

      if (this.autoplayRetryCleanup) {
        this.autoplayRetryCleanup();
        this.autoplayRetryCleanup = null;
      }
    };

    document.addEventListener('click', retry, { once: true });
    document.addEventListener('keydown', retry, { once: true });
    document.addEventListener('scroll', retry, { once: true });
    this.autoplayRetryCleanup = () => {
      document.removeEventListener('click', retry);
      document.removeEventListener('keydown', retry);
      document.removeEventListener('scroll', retry);
    };
  }

  private registerRevealOnly(): void {
    const reveal = () => {
      if (this.portalState !== 'needsInteraction' || this.isDestroyed) return;
      this.setReady();

      if (this.autoplayRetryCleanup) {
        this.autoplayRetryCleanup();
        this.autoplayRetryCleanup = null;
      }
    };

    document.addEventListener('click', reveal, { once: true });
    document.addEventListener('keydown', reveal, { once: true });
    document.addEventListener('scroll', reveal, { once: true });
    this.autoplayRetryCleanup = () => {
      document.removeEventListener('click', reveal);
      document.removeEventListener('keydown', reveal);
      document.removeEventListener('scroll', reveal);
    };
  }

  private setReady(): void {
    if (this.portalState === 'ready') return;
    this.portalState = 'ready';

    // Start WebGL if not already running
    if (!this.gl) {
      this.initWebGLChroma();
    }

    // Give WebGL one frame to render before fading loader
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.isDestroyed) return;

        // Hide loader overlay (fades out over 0.6s via CSS)
        this.loader?.nativeElement.classList.add('hidden');

        // Mark section ready
        const section = this.portalSection.nativeElement;
        section.classList.remove('needs-interaction');
        section.classList.add('ready');

        // Notify nav and other listeners
        document.dispatchEvent(new CustomEvent('portal:entered'));

        // Trigger entrance animations
        this.initEntranceAnimation();

        // Clean up interaction listeners
        if (this.autoplayRetryCleanup) {
          this.autoplayRetryCleanup();
          this.autoplayRetryCleanup = null;
        }
      });
    });
  }

  private initEntranceAnimation(): void {
    // If user already started scrolling, jump directly to final visible state
    if (window.scrollY > 10) {
      this.setEntranceFinalState();
      return;
    }

    // Set initial states via JS so GSAP has full control (avoids CSS conflicts)
    gsap.set(this.portalTitle.nativeElement, { opacity: 1 });
    gsap.set([
      this.titleLeft.nativeElement,
      this.titleRight.nativeElement,
      this.titleSmall.nativeElement,
      this.titleAmp.nativeElement,
      this.portalYear.nativeElement,
      this.hint.nativeElement
    ], { opacity: 0 });
    gsap.set(this.titleLeft.nativeElement, { x: -30 });
    gsap.set(this.titleRight.nativeElement, { x: 30 });

    const tl = gsap.timeline({ delay: 0.2 });
    this.entranceTl = tl;

    // Beat 1: main titles slide in from opposite sides
    tl.to(this.titleLeft.nativeElement,
      { opacity: 1, x: 0, duration: 1.0, ease: 'expo.out' },
      0
    );
    tl.to(this.titleRight.nativeElement,
      { opacity: 1, x: 0, duration: 1.0, ease: 'expo.out' },
      0.15
    );

    // Beat 2: supporting text fades in
    tl.to([
      this.titleSmall.nativeElement,
      this.titleAmp.nativeElement,
      this.portalYear.nativeElement
    ], { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.3);

    // Beat 3: UI affordances (hint)
    tl.to(this.hint.nativeElement,
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      0.6
    );

    // On first scroll, complete entrance immediately so hero pin starts from clean state
    const onScroll = () => {
      if (this.entranceTl?.isActive()) {
        this.entranceTl.progress(1);
      }
    };
    window.addEventListener('scroll', onScroll, { once: true, passive: true });
  }

  private setEntranceFinalState(): void {
    gsap.set([
      this.portalTitle.nativeElement,
      this.titleLeft.nativeElement,
      this.titleRight.nativeElement,
      this.titleSmall.nativeElement,
      this.titleAmp.nativeElement,
      this.portalYear.nativeElement,
      this.hint.nativeElement
    ], { opacity: 1, x: 0, y: 0 });
  }

  private initWebGLChroma(): void {
    if (this.isDestroyed) return;

    const canvas = this.chromaCanvas.nativeElement;
    const video = this.chromaVideo.nativeElement;

    // Clean up previous context if re-initializing
    this.cleanupWebGL(false);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false
    });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    this.gl = gl;

    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_uv = a_uv;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_video;
      void main() {
        vec4 color = texture2D(u_video, v_uv);
        
        // Distance from pure green in RGB space
        vec3 green = vec3(0.0, 1.0, 0.0);
        float dist = distance(color.rgb, green);
        
        // Also check green dominance (green channel significantly higher than red+blue)
        float greenness = color.g - max(color.r, color.b);
        
        // Combine both: pixels that are close to green AND have high green dominance
        float mask = smoothstep(0.25, 0.55, dist);
        float mask2 = smoothstep(0.05, 0.25, greenness);
        float alpha = mask * (1.0 - mask2);
        
        // Despill: remove green tint from edge pixels
        float spill = max(0.0, color.g - max(color.r, color.b));
        color.g -= spill * 0.4;
        
        gl_FragColor = vec4(color.rgb, alpha);
      }
    `;

    const vs = this.compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    this.chromaProgram = program;

    // Look up attribute and uniform locations
    this.aPositionLoc = gl.getAttribLocation(program, 'a_position');
    this.aUvLoc = gl.getAttribLocation(program, 'a_uv');
    this.uVideoLoc = gl.getUniformLocation(program, 'u_video');

    // Position buffer (full-screen quad, 2 triangles)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.aPositionLoc);
    gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // UV buffer
    const uvs = new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0,
    ]);
    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.aUvLoc);
    gl.vertexAttribPointer(this.aUvLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture setup
    this.chromaTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.chromaTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Handle context loss / restore
    this.onContextLost = (e: Event) => {
      e.preventDefault();
      if (this.chromaRafId !== null) {
        cancelAnimationFrame(this.chromaRafId);
        this.chromaRafId = null;
      }
    };
    this.onContextRestored = () => {
      this.initWebGLChroma();
    };
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored);

    // Kick off render loop outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.resizeCanvas();
      this.renderChroma(video);
    });
  }

  private compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private resizeCanvas(): void {
    const canvas = this.chromaCanvas.nativeElement;
    const gl = this.gl;
    if (!canvas || !gl) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  private renderChroma(video: HTMLVideoElement): void {
    if (this.isDestroyed) return;
    const gl = this.gl;
    if (!gl) return;

    this.resizeCanvas();

    const hasData = video.readyState >= video.HAVE_CURRENT_DATA && !video.paused && !video.ended;
    if (hasData) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.chromaTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      this.chromaFramesRendered++;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.uVideoLoc !== null) {
      gl.uniform1i(this.uVideoLoc, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.chromaRafId = requestAnimationFrame(() => this.renderChroma(video));
  }

  private cleanupWebGL(loseContext: boolean): void {
    const gl = this.gl;
    const canvas = this.chromaCanvas?.nativeElement;
    if (canvas) {
      if (this.onContextLost) {
        canvas.removeEventListener('webglcontextlost', this.onContextLost);
        this.onContextLost = null;
      }
      if (this.onContextRestored) {
        canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
        this.onContextRestored = null;
      }
    }
    if (gl) {
      if (this.chromaProgram) {
        gl.deleteProgram(this.chromaProgram);
        this.chromaProgram = null;
      }
      if (this.positionBuffer) {
        gl.deleteBuffer(this.positionBuffer);
        this.positionBuffer = null;
      }
      if (this.uvBuffer) {
        gl.deleteBuffer(this.uvBuffer);
        this.uvBuffer = null;
      }
      if (this.chromaTexture) {
        gl.deleteTexture(this.chromaTexture);
        this.chromaTexture = null;
      }
      if (loseContext) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      this.gl = null;
    }
  }

  private initParticles(): void {
    const canvas = this.particleCanvas?.nativeElement;
    if (!canvas) return;

    this.particleCtx = canvas.getContext('2d');
    if (!this.particleCtx) return;

    this.resizeParticleCanvas();

    // Preload easter egg SVG before creating particles
    const img = new Image();
    img.onload = () => {
      if (this.isDestroyed) return;
      this.easterEggImg = img;
      this.createParticles();
      this.ngZone.runOutsideAngular(() => {
        this.renderParticles();
      });
    };
    img.onerror = () => {
      // If image fails to load, continue with text-only particles
      this.createParticles();
      this.ngZone.runOutsideAngular(() => {
        this.renderParticles();
      });
    };
    img.src = 'assets/easter-eggs/monster.svg';

    window.addEventListener('resize', this.onParticleResize);
  }

  private onParticleResize = (): void => {
    this.resizeParticleCanvas();
  };

  private resizeParticleCanvas(): void {
    const canvas = this.particleCanvas?.nativeElement;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = this.particleCtx;
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  private createParticles(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      // 5% chance to use easter egg SVG instead of text
      const isEasterEgg = this.easterEggImg !== null && Math.random() < this.easterEggChance;
      this.particles.push(new Particle(
        w,
        h,
        this.particleSymbols,
        isEasterEgg ? this.easterEggImg : null
      ));
    }
  }

  private renderParticles(): void {
    if (this.isDestroyed) return;

    const ctx = this.particleCtx;
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      p.update(w, h);
      p.draw(ctx);
    }

    this.particleRafId = requestAnimationFrame(() => this.renderParticles());
  }

  private startTypewriter(): void {
    if (!this.typewriterText?.nativeElement) return;

    const element = this.typewriterText.nativeElement;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseWrite = 1500;
    const pauseDelete = 500;

    const tick = () => {
      if (this.isDestroyed) return;

      if (this.typewriterDirection === 'writing') {
        element.textContent = this.typewriterString.slice(0, this.typewriterIndex + 1);
        this.typewriterIndex++;
        if (this.typewriterIndex >= this.typewriterString.length) {
          this.typewriterDirection = 'deleting';
          this.typewriterTimeout = setTimeout(tick, pauseWrite);
          return;
        }
        this.typewriterTimeout = setTimeout(tick, typeSpeed);
      } else {
        element.textContent = this.typewriterString.slice(0, this.typewriterIndex - 1);
        this.typewriterIndex--;
        if (this.typewriterIndex <= 0) {
          this.typewriterDirection = 'writing';
          this.typewriterTimeout = setTimeout(tick, pauseDelete);
          return;
        }
        this.typewriterTimeout = setTimeout(tick, deleteSpeed);
      }
    };

    tick();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.triggers.forEach(t => t.kill());
    this.entranceTl?.kill();

    window.removeEventListener('resize', this.onParticleResize);

    if (this.particleRafId !== null) {
      cancelAnimationFrame(this.particleRafId);
      this.particleRafId = null;
    }

    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
      this.typewriterTimeout = null;
    }

    if (this.autoplayRetryCleanup) {
      this.autoplayRetryCleanup();
      this.autoplayRetryCleanup = null;
    }

    if (this.chromaRafId !== null) {
      cancelAnimationFrame(this.chromaRafId);
      this.chromaRafId = null;
    }

    const bgVideo = this.bgVideo?.nativeElement;
    if (bgVideo) {
      bgVideo.pause();
      bgVideo.src = '';
      bgVideo.load();
    }

    const video = this.chromaVideo?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }

    this.cleanupWebGL(true);
  }
}

class Particle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  opacity: number;
  size: number;
  symbol: string;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  image: HTMLImageElement | null;

  constructor(w: number, h: number, symbols: string[], image: HTMLImageElement | null = null) {
    this.image = image;
    if (this.image) {
      // Easter egg SVG: fixed larger size for visibility
      this.size = 28;
      this.symbol = '';
    } else {
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      // Tamaño mixto: algunas grandes visibles, otras pequeñas de fondo
      this.size = Math.random() < 0.3
        ? Math.random() * 8 + 18   // 30% grandes: 18px - 26px
        : Math.random() * 8 + 10;  // 70% normales: 10px - 18px
    }
    this.x = Math.random() * w;
    // Distribuidas por toda la pantalla desde el inicio (incluso fuera por abajo)
    this.y = Math.random() * (h * 1.4) - (h * 0.2);
    this.speedY = -(Math.random() * 0.4 + 0.25); // suben lentamente
    this.speedX = (Math.random() - 0.5) * 0.15; // drift suave horizontal
    this.opacity = Math.random() * 0.2 + 0.15; // 0.15 - 0.35 para que se vean sobre fondo oscuro
    this.swayPhase = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * 0.012 + 0.006;
    this.swayAmplitude = Math.random() * 0.6 + 0.4;
  }

  update(w: number, h: number): void {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.swayPhase) * this.swayAmplitude;
    this.swayPhase += this.swaySpeed;

    // Reset cuando sale por arriba → reaparece por abajo (fuera de pantalla)
    if (this.y < -this.size * 2) {
      this.y = h + this.size + Math.random() * 50;
      this.x = Math.random() * w;
    }

    // Wrap horizontal
    if (this.x < -this.size * 2) this.x = w + this.size;
    if (this.x > w + this.size * 2) this.x = -this.size;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    if (this.image) {
      // Draw SVG image centered at particle position
      const aspect = this.image.width / this.image.height;
      const drawW = this.size * aspect;
      const drawH = this.size;
      ctx.drawImage(
        this.image,
        this.x - drawW / 2,
        this.y - drawH / 2,
        drawW,
        drawH
      );
    } else {
      // Color combinado: blanco base + toque de acento cálido
      const r = 234 + (197 - 234) * 0.3;
      const g = 234 + (164 - 234) * 0.3;
      const b = 234 + (126 - 234) * 0.3;
      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

      ctx.font = `${this.size}px var(--font-main)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, this.x, this.y);
    }

    ctx.restore();
  }
}

import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('portalSection') portalSection!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('subtitle') subtitle!: ElementRef;
  @ViewChild('hint') hint!: ElementRef;
  @ViewChild('bgImage') bgImage!: ElementRef;
  @ViewChild('chromaCanvas') chromaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chromaVideo') chromaVideo!: ElementRef<HTMLVideoElement>;

  private triggers: ScrollTrigger[] = [];

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

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initWebGLChroma();
    this.initEntranceAnimation();
    this.initPortalAnimation();
  }

  private initEntranceAnimation(): void {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(this.title.nativeElement.querySelectorAll('.line'), {
      y: 100,
      opacity: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: 'power3.out'
    })
    .from(this.subtitle.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1')
    .from(this.hint.nativeElement, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=0.6');
  }

  private initPortalAnimation(): void {
    const section = this.portalSection.nativeElement;
    const hint = this.hint.nativeElement;
    const bgImage = this.bgImage.nativeElement;
    const chromaCanvasEl = this.chromaCanvas.nativeElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=600%',
        pin: true,
        scrub: 1.2
      }
    });

    // Phase 1: Zoom into the window until wallpaper-1 disappears off-screen
    tl.fromTo(chromaCanvasEl,
      { scale: 1, transformOrigin: 'center center' },
      { scale: 40, ease: 'power2.inOut', duration: 0.5 },
      0
    )
    // Phase 2: Background video scales subtly for depth
    .to(bgImage, {
      scale: 1.15,
      ease: 'none',
      duration: 1
    }, 0)
    // Phase 3: Text fades early
    .to(this.title.nativeElement, {
      opacity: 0,
      y: -40,
      duration: 0.3
    }, 0.15)
    .to(this.subtitle.nativeElement, {
      opacity: 0,
      duration: 0.2
    }, 0.2)
    .to(hint, {
      opacity: 0,
      duration: 0.1
    }, 0)
    // Phase 4: Entire section fades out at the very end
    .to(section, {
      opacity: 0,
      duration: 0.08
    }, 0.95);

    this.triggers.push(tl.scrollTrigger!);
  }

  private initWebGLChroma(): void {
    const canvas = this.chromaCanvas.nativeElement;
    const video = this.chromaVideo.nativeElement;

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

    // Start video playback (safeguard for autoplay policies)
    video.play().catch(err => console.warn('Chroma video autoplay failed:', err));

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
    const gl = this.gl;
    if (!gl) return;

    this.resizeCanvas();

    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.chromaTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.uVideoLoc !== null) {
      gl.uniform1i(this.uVideoLoc, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.chromaRafId = requestAnimationFrame(() => this.renderChroma(video));
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());

    if (this.chromaRafId !== null) {
      cancelAnimationFrame(this.chromaRafId);
    }

    const video = this.chromaVideo?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }

    const gl = this.gl;
    if (gl) {
      if (this.chromaProgram) gl.deleteProgram(this.chromaProgram);
      if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
      if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer);
      if (this.chromaTexture) gl.deleteTexture(this.chromaTexture);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }
}

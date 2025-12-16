import {
  Component,
  signal,
  input,
  output,
  afterNextRender,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Heart, ThumbsUp, Star, Bookmark } from 'lucide-angular';

export type LikeVariant = 'heart' | 'thumbs' | 'star' | 'bookmark';

@Component({
  selector: 'app-single-like-button',
  imports: [LucideAngularModule],
  template: `
    <button
      #button
      class="relative p-3 rounded-full hover:bg-gray-100 transition-colors"
      (click)="toggle()"
    >
      <div #iconWrapper>
        @switch (variant()) {
          @case ('heart') {
            <lucide-icon
              [img]="HeartIcon"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-red-500' : 'text-gray-400'"
            />
          }
          @case ('thumbs') {
            <lucide-icon
              [img]="ThumbsUpIcon"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-blue-500' : 'text-gray-400'"
            />
          }
          @case ('star') {
            <lucide-icon
              [img]="StarIcon"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-yellow-500' : 'text-gray-400'"
            />
          }
          @case ('bookmark') {
            <lucide-icon
              [img]="BookmarkIcon"
              class="w-6 h-6 transition-colors"
              [class]="isLiked() ? 'fill-current text-purple-500' : 'text-gray-400'"
            />
          }
        }
      </div>

      <!-- Ring effect container -->
      <div #ringContainer class="absolute inset-0 pointer-events-none"></div>
      <!-- Particles container -->
      <div #particlesContainer class="absolute inset-0 pointer-events-none"></div>
    </button>
  `,
})
export class SingleLikeButton {
  protected readonly HeartIcon = Heart;
  protected readonly ThumbsUpIcon = ThumbsUp;
  protected readonly StarIcon = Star;
  protected readonly BookmarkIcon = Bookmark;

  // Inputs
  readonly variant = input.required<LikeVariant>();
  readonly initialLiked = input(false);

  // Outputs
  readonly likedChange = output<{ variant: LikeVariant; liked: boolean }>();

  protected readonly isLiked = signal(false);

  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly iconWrapper = viewChild<ElementRef<HTMLDivElement>>('iconWrapper');
  private readonly ringContainer = viewChild<ElementRef<HTMLDivElement>>('ringContainer');
  private readonly particlesContainer = viewChild<ElementRef<HTMLDivElement>>('particlesContainer');

  private readonly colorMap: Record<LikeVariant, string> = {
    heart: 'red',
    thumbs: 'blue',
    star: 'yellow',
    bookmark: 'purple',
  };

  constructor() {
    effect(() => {
      this.isLiked.set(this.initialLiked());
    });

    afterNextRender(() => {
      this.setupButtonAnimation();
    });
  }

  private setupButtonAnimation() {
    const btn = this.button()?.nativeElement;
    if (!btn) return;

    btn.addEventListener('mousedown', () => {
      animate(btn, { scale: 0.85 }, { duration: 0.1 });
    });

    btn.addEventListener('mouseup', () => {
      animate(btn, { scale: 1 }, { duration: 0.1 });
    });

    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1 }, { duration: 0.1 });
    });
  }

  protected toggle() {
    const wasLiked = this.isLiked();
    this.isLiked.set(!wasLiked);

    if (!wasLiked) {
      this.playLikeAnimation();
    }

    this.likedChange.emit({ variant: this.variant(), liked: !wasLiked });
  }

  private playLikeAnimation() {
    const iconWrapper = this.iconWrapper()?.nativeElement;
    if (iconWrapper) {
      animate(
        iconWrapper,
        {
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, -10, 0],
        },
        { duration: 0.5 }
      );
    }

    this.createRingEffect();
    this.createParticles();
  }

  private createRingEffect() {
    const container = this.ringContainer()?.nativeElement;
    if (!container) return;

    const color = this.colorMap[this.variant()];
    const ring = document.createElement('div');
    ring.className = `absolute inset-0 rounded-full border-4 border-${color}-500`;
    ring.style.transform = 'scale(0)';
    ring.style.opacity = '1';
    container.appendChild(ring);

    animate(ring, { scale: [0, 2], opacity: [1, 0] }, { duration: 0.6 }).then(() => {
      ring.remove();
    });
  }

  private createParticles() {
    const container = this.particlesContainer()?.nativeElement;
    if (!container) return;

    const color = this.colorMap[this.variant()];

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 rounded-full bg-${color}-500`;
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.transform = 'translate(-50%, -50%) scale(0)';
      container.appendChild(particle);

      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * 30;
      const y = Math.sin(angle) * 30;

      animate(
        particle,
        {
          scale: [0, 1, 0],
          x: [0, x],
          y: [0, y],
        },
        { duration: 0.6, delay: i * 0.05 }
      ).then(() => {
        particle.remove();
      });
    }
  }
}

@Component({
  selector: 'app-like-button-variants',
  imports: [SingleLikeButton],
  templateUrl: './like-button-variants.html',
})
export class LikeButtonVariants {
  protected onLikeChange(event: { variant: LikeVariant; liked: boolean }) {
    console.log('LikeButtonVariants:', event);
  }
}

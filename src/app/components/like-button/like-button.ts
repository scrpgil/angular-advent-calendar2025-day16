import {
  Component,
  signal,
  computed,
  afterNextRender,
  ElementRef,
  viewChild,
  input,
  output,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Heart } from 'lucide-angular';

@Component({
  selector: 'app-like-button',
  imports: [LucideAngularModule],
  templateUrl: './like-button.html',
})
export class LikeButton {
  protected readonly HeartIcon = Heart;

  // Inputs
  readonly initialLiked = input(false);
  readonly initialCount = input(42);

  // Outputs
  readonly likedChange = output<{ liked: boolean; count: number }>();

  protected readonly isLiked = signal(false);
  protected readonly count = signal(42);

  protected readonly heartClass = computed(() =>
    this.isLiked()
      ? 'transition-colors fill-red-500 text-red-500'
      : 'transition-colors text-gray-400'
  );

  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly heartIcon = viewChild<ElementRef<HTMLElement>>('heartIcon');
  private readonly countEl = viewChild<ElementRef<HTMLSpanElement>>('countEl');

  constructor() {
    effect(() => {
      this.isLiked.set(this.initialLiked());
      this.count.set(this.initialCount());
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

  protected handleLike() {
    const wasLiked = this.isLiked();
    this.isLiked.set(!wasLiked);
    this.count.update((c) => (wasLiked ? c - 1 : c + 1));

    if (!wasLiked) {
      this.playLikeAnimation();
    }

    this.playCountAnimation();

    // Emit output event
    this.likedChange.emit({
      liked: this.isLiked(),
      count: this.count(),
    });
  }

  private playLikeAnimation() {
    const heart = this.heartIcon()?.nativeElement;
    if (!heart) return;

    // ハートの拡大アニメーション
    animate(
      heart,
      { scale: [1, 1.3, 1] },
      { duration: 0.3 }
    );

    // リップルエフェクト
    this.createRipple();
  }

  private createRipple() {
    const btn = this.button()?.nativeElement;
    if (!btn) return;

    const ripple = document.createElement('div');
    ripple.className = 'absolute inset-0 rounded-full border-4 border-red-500 pointer-events-none';
    btn.appendChild(ripple);

    animate(
      ripple,
      { scale: [0, 2], opacity: [1, 0] },
      { duration: 0.6 }
    ).then(() => {
      ripple.remove();
    });
  }

  private playCountAnimation() {
    const count = this.countEl()?.nativeElement;
    if (!count) return;

    animate(
      count,
      { scale: [1.5, 1], opacity: [0, 1] },
      { duration: 0.2 }
    );
  }
}

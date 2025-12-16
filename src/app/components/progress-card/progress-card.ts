import {
  Component,
  signal,
  computed,
  ElementRef,
  viewChild,
  afterNextRender,
  OnDestroy,
  input,
  output,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Play, RotateCcw } from 'lucide-angular';

@Component({
  selector: 'app-progress-card',
  imports: [LucideAngularModule],
  templateUrl: './progress-card.html',
})
export class ProgressCard implements OnDestroy {
  protected readonly PlayIcon = Play;
  protected readonly RotateCcwIcon = RotateCcw;
  // Inputs
  readonly initialProgress = input(0);

  // Outputs
  readonly progressChange = output<number>();
  readonly completed = output<void>();

  protected readonly progress = signal(0);
  protected readonly isAnimating = signal(false);

  protected readonly progressWidth = computed(() => `${this.progress()}%`);

  protected readonly startButtonClass = computed(() =>
    this.isAnimating()
      ? 'opacity-50 cursor-not-allowed'
      : ''
  );

  protected readonly resetButtonClass = computed(() =>
    this.isAnimating()
      ? 'opacity-50 cursor-not-allowed'
      : ''
  );

  private readonly progressBar = viewChild<ElementRef<HTMLDivElement>>('progressBar');
  private readonly shimmer = viewChild<ElementRef<HTMLDivElement>>('shimmer');
  private readonly startButton = viewChild<ElementRef<HTMLButtonElement>>('startButton');
  private readonly resetButton = viewChild<ElementRef<HTMLButtonElement>>('resetButton');

  private shimmerAnimation: ReturnType<typeof animate> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      this.progress.set(this.initialProgress());
    });

    afterNextRender(() => {
      this.setupButtonAnimations();
    });
  }

  ngOnDestroy() {
    this.shimmerAnimation?.stop();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private setupButtonAnimations() {
    const setupHover = (btn: HTMLButtonElement | undefined, checkDisabled: () => boolean) => {
      if (!btn) return;

      btn.addEventListener('mouseenter', () => {
        if (!checkDisabled()) {
          animate(btn, { scale: 1.05 }, { duration: 0.2 });
        }
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, { scale: 1 }, { duration: 0.2 });
      });

      btn.addEventListener('mousedown', () => {
        if (!checkDisabled()) {
          animate(btn, { scale: 0.95 }, { duration: 0.1 });
        }
      });

      btn.addEventListener('mouseup', () => {
        if (!checkDisabled()) {
          animate(btn, { scale: 1.05 }, { duration: 0.1 });
        }
      });
    };

    setupHover(this.startButton()?.nativeElement, () => this.isAnimating());
    setupHover(this.resetButton()?.nativeElement, () => this.isAnimating());
  }

  protected startProgress() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    this.progress.set(0);

    this.startShimmerAnimation();

    this.intervalId = setInterval(() => {
      const currentProgress = this.progress();
      if (currentProgress >= 100) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        this.isAnimating.set(false);
        this.shimmerAnimation?.stop();
        this.completed.emit();
        return;
      }
      this.progress.set(currentProgress + 2);
      this.progressChange.emit(currentProgress + 2);
    }, 50);
  }

  protected reset() {
    if (this.isAnimating()) return;

    this.progress.set(0);
    this.shimmerAnimation?.stop();
  }

  private startShimmerAnimation() {
    const shimmerEl = this.shimmer()?.nativeElement;
    if (!shimmerEl) return;

    this.shimmerAnimation = animate(
      shimmerEl,
      { x: ['0%', '400%'] },
      {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }
    );
  }
}

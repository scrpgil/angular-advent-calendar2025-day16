import {
  Component,
  signal,
  afterNextRender,
  ElementRef,
  viewChild,
  effect,
  input,
  output,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Minus, Plus } from 'lucide-angular';

@Component({
  selector: 'app-counter-card',
  imports: [LucideAngularModule],
  templateUrl: './counter-card.html',
})
export class CounterCard {
  protected readonly MinusIcon = Minus;
  protected readonly PlusIcon = Plus;
  // Inputs
  readonly initialValue = input(0);

  // Outputs
  readonly valueChange = output<number>();

  protected readonly count = signal(0);
  protected readonly displayCount = signal(0);

  private readonly minusButton = viewChild<ElementRef<HTMLButtonElement>>('minusButton');
  private readonly resetButton = viewChild<ElementRef<HTMLButtonElement>>('resetButton');
  private readonly plusButton = viewChild<ElementRef<HTMLButtonElement>>('plusButton');
  private readonly countDisplay = viewChild<ElementRef<HTMLDivElement>>('countDisplay');

  private animationFrame: number | null = null;
  private isInitialized = false;

  constructor() {
    effect(() => {
      const initial = this.initialValue();
      if (!this.isInitialized) {
        this.count.set(initial);
        this.displayCount.set(initial);
        this.isInitialized = true;
      }
    });

    afterNextRender(() => {
      this.setupButtonAnimations();
    });

    effect(() => {
      const targetValue = this.count();
      this.animateCounter(targetValue);
    });
  }

  private setupButtonAnimations() {
    const setupButton = (btn: HTMLButtonElement | undefined) => {
      if (!btn) return;

      btn.addEventListener('mouseenter', () => {
        animate(btn, { scale: 1.1 }, { duration: 0.2 });
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, { scale: 1 }, { duration: 0.2 });
      });

      btn.addEventListener('mousedown', () => {
        animate(btn, { scale: 0.9 }, { duration: 0.1 });
      });

      btn.addEventListener('mouseup', () => {
        animate(btn, { scale: 1.1 }, { duration: 0.1 });
      });
    };

    setupButton(this.minusButton()?.nativeElement);
    setupButton(this.plusButton()?.nativeElement);

    const resetBtn = this.resetButton()?.nativeElement;
    if (resetBtn) {
      resetBtn.addEventListener('mouseenter', () => {
        animate(resetBtn, { scale: 1.05 }, { duration: 0.2 });
      });

      resetBtn.addEventListener('mouseleave', () => {
        animate(resetBtn, { scale: 1 }, { duration: 0.2 });
      });

      resetBtn.addEventListener('mousedown', () => {
        animate(resetBtn, { scale: 0.95 }, { duration: 0.1 });
      });

      resetBtn.addEventListener('mouseup', () => {
        animate(resetBtn, { scale: 1.05 }, { duration: 0.1 });
      });
    }
  }

  private animateCounter(targetValue: number) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const startValue = this.displayCount();
    const duration = 500;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

      this.displayCount.set(currentValue);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(updateCounter);
      }
    };

    this.animationFrame = requestAnimationFrame(updateCounter);
  }

  protected decrement() {
    this.count.update((c) => c - 1);
    this.valueChange.emit(this.count());
  }

  protected reset() {
    this.count.set(0);
    this.valueChange.emit(0);
  }

  protected increment() {
    this.count.update((c) => c + 1);
    this.valueChange.emit(this.count());
  }
}

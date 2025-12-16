import {
  Component,
  afterNextRender,
  ElementRef,
  viewChild,
  OnDestroy,
  output,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Bell } from 'lucide-angular';

@Component({
  selector: 'app-pulse-button',
  imports: [LucideAngularModule],
  templateUrl: './pulse-button.html',
})
export class PulseButton implements OnDestroy {
  protected readonly BellIcon = Bell;

  // Outputs
  readonly clicked = output<void>();

  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly badge = viewChild<ElementRef<HTMLSpanElement>>('badge');
  private readonly ripple = viewChild<ElementRef<HTMLDivElement>>('ripple');

  private badgeAnimation: ReturnType<typeof animate> | null = null;
  private rippleAnimation: ReturnType<typeof animate> | null = null;

  constructor() {
    afterNextRender(() => {
      this.setupAnimations();
      this.setupButtonAnimation();
    });
  }

  ngOnDestroy() {
    this.badgeAnimation?.stop();
    this.rippleAnimation?.stop();
  }

  protected onClick() {
    this.clicked.emit();
  }

  private setupAnimations() {
    const badgeEl = this.badge()?.nativeElement;
    if (badgeEl) {
      this.badgeAnimation = animate(
        badgeEl,
        { scale: [1, 1.2, 1] },
        {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      );
    }

    const rippleEl = this.ripple()?.nativeElement;
    if (rippleEl) {
      this.rippleAnimation = animate(
        rippleEl,
        {
          scale: [1, 1.5, 1.8],
          opacity: [0.5, 0.2, 0],
        },
        {
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }
      );
    }
  }

  private setupButtonAnimation() {
    const btn = this.button()?.nativeElement;
    if (!btn) return;

    btn.addEventListener('mouseenter', () => {
      animate(btn, { scale: 1.05 }, { duration: 0.2 });
    });

    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1 }, { duration: 0.2 });
    });

    btn.addEventListener('mousedown', () => {
      animate(btn, { scale: 0.95 }, { duration: 0.1 });
    });

    btn.addEventListener('mouseup', () => {
      animate(btn, { scale: 1.05 }, { duration: 0.1 });
    });
  }
}

import {
  Component,
  afterNextRender,
  ElementRef,
  viewChild,
  output,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';

@Component({
  selector: 'app-hover-card',
  imports: [LucideAngularModule],
  templateUrl: './hover-card.html',
})
export class HoverCard {
  protected readonly ShoppingCartIcon = ShoppingCart;
  protected readonly StarIcon = Star;
  // Outputs
  readonly buttonClick = output<void>();

  private readonly card = viewChild<ElementRef<HTMLDivElement>>('card');
  private readonly overlay = viewChild<ElementRef<HTMLDivElement>>('overlay');
  private readonly content = viewChild<ElementRef<HTMLDivElement>>('content');
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly circle = viewChild<ElementRef<HTMLDivElement>>('circle');

  constructor() {
    afterNextRender(() => {
      this.setupHoverAnimations();
    });
  }

  protected onButtonClick() {
    this.buttonClick.emit();
  }

  private setupHoverAnimations() {
    const cardEl = this.card()?.nativeElement;
    const overlayEl = this.overlay()?.nativeElement;
    const contentEl = this.content()?.nativeElement;
    const buttonEl = this.button()?.nativeElement;
    const circleEl = this.circle()?.nativeElement;

    if (!cardEl) return;

    cardEl.addEventListener('mouseenter', () => {
      if (overlayEl) {
        animate(overlayEl, { opacity: 0.1 }, { duration: 0.3 });
      }
      if (contentEl) {
        animate(contentEl, { y: -5 }, { duration: 0.3 });
      }
      if (buttonEl) {
        animate(buttonEl, { scale: 1.05, backgroundColor: '#2563eb' }, { duration: 0.3 });
      }
      if (circleEl) {
        animate(circleEl, { scale: 1, opacity: 0.1 }, { duration: 0.4 });
      }
    });

    cardEl.addEventListener('mouseleave', () => {
      if (overlayEl) {
        animate(overlayEl, { opacity: 0 }, { duration: 0.3 });
      }
      if (contentEl) {
        animate(contentEl, { y: 0 }, { duration: 0.3 });
      }
      if (buttonEl) {
        animate(buttonEl, { scale: 1, backgroundColor: '#3b82f6' }, { duration: 0.3 });
      }
      if (circleEl) {
        animate(circleEl, { scale: 0, opacity: 0 }, { duration: 0.4 });
      }
    });

    if (buttonEl) {
      buttonEl.addEventListener('mousedown', () => {
        animate(buttonEl, { scale: 0.95 }, { duration: 0.1 });
      });

      buttonEl.addEventListener('mouseup', () => {
        animate(buttonEl, { scale: 1.05 }, { duration: 0.1 });
      });
    }
  }
}

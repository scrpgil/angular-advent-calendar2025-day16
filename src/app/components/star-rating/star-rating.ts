import {
  Component,
  signal,
  computed,
  afterNextRender,
  ElementRef,
  viewChildren,
  input,
  output,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-star-rating',
  imports: [LucideAngularModule],
  templateUrl: './star-rating.html',
})
export class StarRating {
  protected readonly StarIcon = Star;
  // Inputs
  readonly initialRating = input(0);

  // Outputs
  readonly ratingChange = output<number>();

  protected readonly rating = signal(0);
  protected readonly hover = signal(0);

  protected readonly displayRating = computed(() => {
    const r = this.rating();
    return r === 0 ? '評価してください' : `${r}つ星の評価`;
  });

  private readonly starButtons = viewChildren<ElementRef<HTMLButtonElement>>('starButton');
  private readonly ratingText = viewChildren<ElementRef<HTMLParagraphElement>>('ratingText');

  constructor() {
    effect(() => {
      this.rating.set(this.initialRating());
    });

    afterNextRender(() => {
      this.setupStarAnimations();
    });
  }

  private setupStarAnimations() {
    const buttons = this.starButtons();
    buttons.forEach((btnRef) => {
      const btn = btnRef.nativeElement;

      btn.addEventListener('mouseenter', () => {
        animate(btn, { scale: 1.2 }, { duration: 0.2 });
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, { scale: 1 }, { duration: 0.2 });
      });

      btn.addEventListener('mousedown', () => {
        animate(btn, { scale: 0.9 }, { duration: 0.1 });
      });

      btn.addEventListener('mouseup', () => {
        animate(btn, { scale: 1.2 }, { duration: 0.1 });
      });
    });
  }

  protected onStarClick(star: number) {
    this.rating.set(star);
    this.animateRatingText();
    this.ratingChange.emit(star);
  }

  protected onStarEnter(star: number) {
    this.hover.set(star);
  }

  protected onStarLeave() {
    this.hover.set(0);
  }

  protected getStarClass(star: number): string {
    const activeRating = this.hover() || this.rating();
    return star <= activeRating
      ? 'fill-yellow-400 text-yellow-400'
      : 'text-gray-300';
  }

  protected isActiveStar(star: number): boolean {
    const activeRating = this.hover() || this.rating();
    return star === activeRating;
  }

  private animateRatingText() {
    const textEl = document.querySelector('[data-rating-text]');
    if (textEl) {
      animate(
        textEl,
        { scale: [1.5, 1], opacity: [0, 1] },
        { duration: 0.3 }
      );
    }
  }

  protected readonly stars = [1, 2, 3, 4, 5];
}

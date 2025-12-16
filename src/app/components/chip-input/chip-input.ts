import {
  Component,
  signal,
  afterNextRender,
  ElementRef,
  viewChild,
  input,
  output,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-chip-input',
  imports: [LucideAngularModule],
  templateUrl: './chip-input.html',
})
export class ChipInput {
  protected readonly XIcon = X;
  // Inputs
  readonly initialChips = input<string[]>(['React', 'TypeScript', 'Tailwind']);

  // Outputs
  readonly chipsChange = output<string[]>();
  readonly chipAdded = output<string>();
  readonly chipRemoved = output<string>();

  protected readonly chips = signal<string[]>([]);
  protected readonly inputValue = signal('');

  private readonly chipsContainer = viewChild<ElementRef<HTMLDivElement>>('chipsContainer');

  constructor() {
    effect(() => {
      this.chips.set(this.initialChips());
    });

    afterNextRender(() => {
      // Initial setup if needed
    });
  }

  protected onKeyDown(event: KeyboardEvent) {
    const input = this.inputValue().trim();

    if (event.key === 'Enter' && input) {
      event.preventDefault();
      this.addChip(input);
    } else if (event.key === 'Backspace' && !this.inputValue() && this.chips().length > 0) {
      this.removeLastChip();
    }
  }

  protected onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.inputValue.set(target.value);
  }

  private addChip(chip: string) {
    this.chips.update((current) => [...current, chip]);
    this.inputValue.set('');

    // Emit outputs
    this.chipAdded.emit(chip);
    this.chipsChange.emit(this.chips());

    // Animate the new chip
    setTimeout(() => {
      const container = this.chipsContainer()?.nativeElement;
      if (container) {
        const lastChip = container.querySelector('[data-chip]:last-of-type');
        if (lastChip) {
          animate(
            lastChip,
            { scale: [0, 1], opacity: [0, 1] },
            { duration: 0.2 }
          );
        }
      }
    }, 0);
  }

  protected removeChip(index: number) {
    const container = this.chipsContainer()?.nativeElement;
    const removedChip = this.chips()[index];

    const doRemove = () => {
      this.chips.update((current) => current.filter((_, i) => i !== index));
      this.chipRemoved.emit(removedChip);
      this.chipsChange.emit(this.chips());
    };

    if (container) {
      const chipElements = container.querySelectorAll('[data-chip]');
      const chipToRemove = chipElements[index];

      if (chipToRemove) {
        animate(
          chipToRemove,
          { scale: [1, 0], opacity: [1, 0] },
          { duration: 0.2 }
        ).then(() => {
          doRemove();
        });
      } else {
        doRemove();
      }
    } else {
      doRemove();
    }
  }

  private removeLastChip() {
    const currentChips = this.chips();
    if (currentChips.length > 0) {
      this.removeChip(currentChips.length - 1);
    }
  }

  protected onRemoveButtonHover(event: MouseEvent, isEntering: boolean) {
    const button = event.currentTarget as HTMLButtonElement;
    animate(button, { scale: isEntering ? 1.2 : 1 }, { duration: 0.1 });
  }

  protected onRemoveButtonClick(event: MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    animate(button, { scale: 0.8 }, { duration: 0.1 });
  }
}

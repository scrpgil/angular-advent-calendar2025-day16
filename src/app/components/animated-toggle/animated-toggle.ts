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
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'app-animated-toggle',
  imports: [LucideAngularModule],
  templateUrl: './animated-toggle.html',
})
export class AnimatedToggle {
  protected readonly MoonIcon = Moon;
  protected readonly SunIcon = Sun;
  // Inputs
  readonly initialValue = input(false);

  // Outputs
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);

  protected readonly buttonBgClass = computed(() =>
    this.isOn() ? 'bg-blue-500' : 'bg-gray-300'
  );

  protected readonly labelText = computed(() =>
    this.isOn() ? 'ダークモード' : 'ライトモード'
  );

  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => {
      this.isOn.set(this.initialValue());
    });

    afterNextRender(() => {
      this.updateKnobPosition(this.isOn());
    });
  }

  protected toggle() {
    const wasOn = this.isOn();
    this.isOn.set(!wasOn);
    this.updateKnobPosition(!wasOn);
    this.toggled.emit(!wasOn);
  }

  private updateKnobPosition(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;

    animate(
      knobEl,
      { x: isOn ? 40 : 0 },
      {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }
    );
  }
}

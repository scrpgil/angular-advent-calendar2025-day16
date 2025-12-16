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
import { LucideAngularModule, Check, X } from 'lucide-angular';

@Component({
  selector: 'app-minimal-toggle',
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="w-16 h-8 flex items-center rounded-full p-1 transition-colors"
        [class]="isOn() ? 'bg-green-500' : 'bg-gray-300'"
        (click)="toggle()"
      >
        <div #knob class="w-6 h-6 bg-white rounded-full shadow-md"></div>
      </button>
      <span class="text-xs text-gray-600">ミニマル</span>
    </div>
  `,
})
export class MinimalToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;
    animate(knobEl, { x: isOn ? 32 : 0 }, { type: 'spring', stiffness: 500, damping: 30 });
  }
}

@Component({
  selector: 'app-icon-toggle',
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="w-16 h-8 flex items-center rounded-full p-1 transition-colors"
        [class]="isOn() ? 'bg-blue-500' : 'bg-red-400'"
        (click)="toggle()"
      >
        <div #knob class="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          @if (isOn()) {
            <lucide-icon [img]="CheckIcon" class="w-4 h-4 text-blue-500" [strokeWidth]="3" />
          } @else {
            <lucide-icon [img]="XIcon" class="w-4 h-4 text-red-400" [strokeWidth]="3" />
          }
        </div>
      </button>
      <span class="text-xs text-gray-600">アイコン付き</span>
    </div>
  `,
})
export class IconToggle {
  protected readonly CheckIcon = Check;
  protected readonly XIcon = X;
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;
    animate(knobEl, { x: isOn ? 32 : 0 }, { type: 'spring', stiffness: 500, damping: 30 });
  }
}

@Component({
  selector: 'app-material-toggle',
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="relative w-14 h-8 rounded-full transition-colors"
        [class]="isOn() ? 'bg-purple-200' : 'bg-gray-300'"
        (click)="toggle()"
      >
        <div
          #knob
          class="absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg transition-colors"
          [class]="isOn() ? 'bg-purple-600' : 'bg-gray-500'"
        ></div>
      </button>
      <span class="text-xs text-gray-600">マテリアル</span>
    </div>
  `,
})
export class MaterialToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;
    animate(
      knobEl,
      { x: isOn ? 24 : 0, scale: isOn ? 1.2 : 1 },
      { type: 'spring', stiffness: 500, damping: 30 }
    );
  }
}

@Component({
  selector: 'app-square-toggle',
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="w-16 h-8 flex items-center rounded-lg p-1 border-2 transition-colors"
        [class]="isOn() ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'"
        (click)="toggle()"
      >
        <div
          #knob
          class="w-6 h-6 rounded transition-colors"
          [class]="isOn() ? 'bg-white' : 'bg-gray-400'"
        ></div>
      </button>
      <span class="text-xs text-gray-600">スクエア</span>
    </div>
  `,
})
export class SquareToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    if (!knobEl) return;
    animate(knobEl, { x: isOn ? 32 : 0 }, { type: 'spring', stiffness: 500, damping: 30 });
  }
}

@Component({
  selector: 'app-glow-toggle',
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="relative w-16 h-8 flex items-center rounded-full p-1 transition-colors"
        [class]="isOn() ? 'bg-cyan-500' : 'bg-gray-300'"
        (click)="toggle()"
      >
        <div #knob class="w-6 h-6 bg-white rounded-full shadow-md"></div>
      </button>
      <span class="text-xs text-gray-600">グロー</span>
    </div>
  `,
})
export class GlowToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    const buttonEl = this.button()?.nativeElement;
    if (!knobEl) return;

    animate(
      knobEl,
      {
        x: isOn ? 32 : 0,
        boxShadow: isOn
          ? '0 0 15px rgba(255, 255, 255, 0.8)'
          : '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      { type: 'spring', stiffness: 500, damping: 30 }
    );

    if (buttonEl) {
      animate(buttonEl, {
        boxShadow: isOn
          ? '0 0 20px rgba(6, 182, 212, 0.6)'
          : '0 0 0px rgba(0, 0, 0, 0)',
      });
    }
  }
}

@Component({
  selector: 'app-slide-toggle',
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        #button
        class="relative w-20 h-8 bg-gray-200 rounded-full overflow-hidden"
        (click)="toggle()"
      >
        <div
          #background
          class="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500"
          style="transform: translateX(-100%)"
        ></div>
        <div #knob class="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"></div>
      </button>
      <span class="text-xs text-gray-600">スライド</span>
    </div>
  `,
})
export class SlideToggle {
  readonly initialValue = input(false);
  readonly toggled = output<boolean>();

  protected readonly isOn = signal(false);
  private readonly knob = viewChild<ElementRef<HTMLDivElement>>('knob');
  private readonly background = viewChild<ElementRef<HTMLDivElement>>('background');

  constructor() {
    effect(() => this.isOn.set(this.initialValue()));
    afterNextRender(() => this.updateKnob(this.isOn()));
  }

  protected toggle() {
    const newValue = !this.isOn();
    this.isOn.set(newValue);
    this.updateKnob(newValue);
    this.toggled.emit(newValue);
  }

  private updateKnob(isOn: boolean) {
    const knobEl = this.knob()?.nativeElement;
    const bgEl = this.background()?.nativeElement;
    if (!knobEl) return;

    animate(knobEl, { x: isOn ? 52 : 4 }, { type: 'spring', stiffness: 500, damping: 30 });

    if (bgEl) {
      animate(bgEl, { x: isOn ? '0%' : '-100%' }, { type: 'spring', stiffness: 300, damping: 30 });
    }
  }
}

@Component({
  selector: 'app-toggle-switch-variants',
  imports: [
    MinimalToggle,
    IconToggle,
    MaterialToggle,
    SquareToggle,
    GlowToggle,
    SlideToggle,
  ],
  templateUrl: './toggle-switch-variants.html',
})
export class ToggleSwitchVariants {
  protected onToggle(variant: string, value: boolean) {
    console.log('ToggleSwitchVariants:', { variant, value });
  }
}

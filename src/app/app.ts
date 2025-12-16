import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LikeButton } from './components/like-button/like-button';
import { AnimatedToggle } from './components/animated-toggle/animated-toggle';
import { PulseButton } from './components/pulse-button/pulse-button';
import { ProgressCard } from './components/progress-card/progress-card';
import { HoverCard } from './components/hover-card/hover-card';
import { CheckboxAnimation, Task } from './components/checkbox-animation/checkbox-animation';
import { CounterCard } from './components/counter-card/counter-card';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { LikeButtonVariants } from './components/like-button-variants/like-button-variants';
import { ToggleSwitchVariants } from './components/toggle-switch-variants/toggle-switch-variants';
import { StarRating } from './components/star-rating/star-rating';
import { ChipInput } from './components/chip-input/chip-input';
import { CodeTabs } from './components/code-tabs/code-tabs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LikeButton,
    AnimatedToggle,
    PulseButton,
    ProgressCard,
    HoverCard,
    CheckboxAnimation,
    CounterCard,
    LoadingSpinner,
    LikeButtonVariants,
    ToggleSwitchVariants,
    StarRating,
    ChipInput,
    CodeTabs,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-advent-calendar2026-day16');

  // Event handlers
  protected onLikeChange(event: { liked: boolean; count: number }) {
    console.log('LikeButton:', event);
  }

  protected onToggleChange(value: boolean) {
    console.log('AnimatedToggle:', value);
  }

  protected onPulseClick() {
    console.log('PulseButton: clicked');
  }

  protected onProgressChange(value: number) {
    console.log('ProgressCard progress:', value);
  }

  protected onProgressComplete() {
    console.log('ProgressCard: completed');
  }

  protected onHoverCardClick() {
    console.log('HoverCard: button clicked');
  }

  protected onTasksChange(tasks: Task[]) {
    console.log('CheckboxAnimation tasks:', tasks);
  }

  protected onTaskToggled(event: { task: Task; completed: boolean }) {
    console.log('CheckboxAnimation task toggled:', event);
  }

  protected onCounterChange(value: number) {
    console.log('CounterCard:', value);
  }

  protected onLikeVariantChange(event: { variant: string; liked: boolean }) {
    console.log('LikeButtonVariants:', event);
  }

  protected onToggleVariantChange(value: boolean) {
    console.log('ToggleSwitchVariants:', value);
  }

  protected onRatingChange(value: number) {
    console.log('StarRating:', value);
  }

  protected onChipsChange(chips: string[]) {
    console.log('ChipInput chips:', chips);
  }

  protected onChipAdded(chip: string) {
    console.log('ChipInput chip added:', chip);
  }

  protected onChipRemoved(chip: string) {
    console.log('ChipInput chip removed:', chip);
  }
}

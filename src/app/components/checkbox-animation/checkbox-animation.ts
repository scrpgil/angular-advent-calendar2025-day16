import {
  Component,
  signal,
  ElementRef,
  afterNextRender,
  viewChildren,
  input,
  output,
  effect,
} from '@angular/core';
import { animate } from 'motion';
import { LucideAngularModule, Check } from 'lucide-angular';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-checkbox-animation',
  imports: [LucideAngularModule],
  templateUrl: './checkbox-animation.html',
})
export class CheckboxAnimation {
  protected readonly CheckIcon = Check;
  // Inputs
  readonly initialTasks = input<Task[]>([
    { id: 1, text: 'メールを確認する', completed: false },
    { id: 2, text: '会議の準備をする', completed: false },
    { id: 3, text: 'レポートを提出する', completed: false },
  ]);

  // Outputs
  readonly tasksChange = output<Task[]>();
  readonly taskToggled = output<{ task: Task; completed: boolean }>();

  protected readonly tasks = signal<Task[]>([]);

  private readonly checkboxes = viewChildren<ElementRef<HTMLDivElement>>('checkbox');
  private readonly strikethroughs = viewChildren<ElementRef<HTMLSpanElement>>('strikethrough');

  constructor() {
    effect(() => {
      this.tasks.set(this.initialTasks());
    });

    afterNextRender(() => {
      // Initial setup if needed
    });
  }

  protected toggleTask(taskId: number, index: number) {
    const currentTasks = this.tasks();
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return;

    const wasCompleted = task.completed;
    const newCompleted = !wasCompleted;

    const updatedTasks = currentTasks.map((t) =>
      t.id === taskId ? { ...t, completed: newCompleted } : t
    );

    this.tasks.set(updatedTasks);

    this.animateCheckbox(index, newCompleted);
    this.animateStrikethrough(index, newCompleted);

    // Emit outputs
    this.tasksChange.emit(updatedTasks);
    this.taskToggled.emit({ task: { ...task, completed: newCompleted }, completed: newCompleted });
  }

  private animateCheckbox(index: number, completed: boolean) {
    const checkboxList = this.checkboxes();
    const checkbox = checkboxList[index]?.nativeElement;
    if (!checkbox) return;

    if (completed) {
      animate(
        checkbox,
        { scale: [1, 1.2, 1] },
        { duration: 0.3 }
      );
    }
  }

  private animateStrikethrough(index: number, completed: boolean) {
    const strikethroughList = this.strikethroughs();
    const strikethrough = strikethroughList[index]?.nativeElement;
    if (!strikethrough) return;

    if (completed) {
      animate(
        strikethrough,
        { width: ['0%', '100%'] },
        { duration: 0.3 }
      );
    } else {
      animate(
        strikethrough,
        { width: '0%' },
        { duration: 0.2 }
      );
    }
  }

  protected getCheckboxClass(completed: boolean): string {
    return completed
      ? 'bg-blue-500 border-blue-500'
      : 'bg-white border-gray-300';
  }

  protected getTextClass(completed: boolean): string {
    return completed ? 'text-gray-400' : 'text-gray-700';
  }
}

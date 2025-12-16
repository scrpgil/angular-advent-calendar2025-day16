import { Component, input, signal, effect } from '@angular/core';
import { LucideAngularModule, Github } from 'lucide-angular';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/scrpgil/angular-advent-calendar2025-day16/main/src/app/components';
const GITHUB_BASE = 'https://github.com/scrpgil/angular-advent-calendar2025-day16/blob/main/src/app/components';

@Component({
  selector: 'app-code-tabs',
  imports: [LucideAngularModule],
  template: `
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <!-- タブヘッダー -->
      <div class="flex border-b border-gray-200 bg-gray-50">
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          [class]="activeTab() === 'demo' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
          (click)="activeTab.set('demo')"
        >
          デモ
        </button>
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          [class]="activeTab() === 'ts' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
          (click)="showTab('ts')"
        >
          TypeScript
        </button>
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          [class]="activeTab() === 'html' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
          (click)="showTab('html')"
        >
          HTML
        </button>
        <a
          [href]="githubUrl()"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-auto px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <lucide-icon [img]="GithubIcon" class="w-4 h-4" />
          GitHub
        </a>
      </div>

      <!-- コンテンツ -->
      <div class="bg-white">
        @if (activeTab() === 'demo') {
          <div class="p-8 flex justify-center">
            <ng-content></ng-content>
          </div>
        } @else if (activeTab() === 'ts') {
          <div class="bg-gray-900 p-4 overflow-x-auto max-h-96 overflow-y-auto">
            @if (isLoading()) {
              <div class="text-gray-400 text-sm">読み込み中...</div>
            } @else if (errorMessage()) {
              <div class="text-red-400 text-sm">{{ errorMessage() }}</div>
            } @else {
              <pre class="text-green-400 text-sm"><code>{{ tsCode() }}</code></pre>
            }
          </div>
        } @else if (activeTab() === 'html') {
          <div class="bg-gray-900 p-4 overflow-x-auto max-h-96 overflow-y-auto">
            @if (isLoading()) {
              <div class="text-gray-400 text-sm">読み込み中...</div>
            } @else if (errorMessage()) {
              <div class="text-red-400 text-sm">{{ errorMessage() }}</div>
            } @else {
              <pre class="text-green-400 text-sm"><code>{{ htmlCode() }}</code></pre>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class CodeTabs {
  protected readonly GithubIcon = Github;
  readonly componentName = input.required<string>();

  protected readonly activeTab = signal<'demo' | 'ts' | 'html'>('demo');
  protected readonly tsCode = signal('');
  protected readonly htmlCode = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  private loadedTs = false;
  private loadedHtml = false;

  protected githubUrl() {
    return `${GITHUB_BASE}/${this.componentName()}`;
  }

  protected async showTab(tab: 'ts' | 'html') {
    this.activeTab.set(tab);

    if (tab === 'ts' && !this.loadedTs) {
      await this.fetchCode('ts');
    } else if (tab === 'html' && !this.loadedHtml) {
      await this.fetchCode('html');
    }
  }

  private async fetchCode(type: 'ts' | 'html') {
    const name = this.componentName();
    const ext = type === 'ts' ? 'ts' : 'html';
    const url = `${GITHUB_RAW_BASE}/${name}/${name}.${ext}`;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const code = await response.text();

      if (type === 'ts') {
        this.tsCode.set(code);
        this.loadedTs = true;
      } else {
        this.htmlCode.set(code);
        this.loadedHtml = true;
      }
    } catch (error) {
      this.errorMessage.set(`コードの取得に失敗しました: ${error}`);
    } finally {
      this.isLoading.set(false);
    }
  }
}

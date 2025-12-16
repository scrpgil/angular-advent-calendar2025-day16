import { Component, input, signal, effect } from '@angular/core';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/scrpgil/angular-advent-calendar2026-day16/main/src/app/components';
const GITHUB_BASE = 'https://github.com/scrpgil/angular-advent-calendar2026-day16/blob/main/src/app/components';

@Component({
  selector: 'app-code-tabs',
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
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
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

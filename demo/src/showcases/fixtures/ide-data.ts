/**
 * Tree, list, and file content fixtures for IDE showcases.
 */
import type { Action, TabItem, StatusBarItem, TreeNode, ListItem } from '@core/types'

// ---------------------------------------------------------------------------
// Activity Bar
// ---------------------------------------------------------------------------
export const activityItems: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
  { id: 'source-control', label: 'Source Control', icon: 'codicon:source-control' },
  { id: 'debug', label: 'Run and Debug', icon: 'codicon:debug-alt' },
  { id: 'extensions', label: 'Extensions', icon: 'codicon:extensions' },
]

// ---------------------------------------------------------------------------
// Explorer Tree
// ---------------------------------------------------------------------------
export const explorerTree: TreeNode[] = [
  {
    id: 'node-modules',
    label: 'node_modules',
    icon: 'codicon:folder',
    children: [
      { id: 'nm-vue', label: 'vue', icon: 'codicon:folder', children: [] },
      { id: 'nm-vite', label: 'vite', icon: 'codicon:folder', children: [] },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: 'codicon:folder',
    children: [{ id: 'favicon', label: 'favicon.ico', icon: 'codicon:file-media' }],
  },
  {
    id: 'src',
    label: 'src',
    icon: 'codicon:folder',
    children: [
      {
        id: 'src/components',
        label: 'components',
        icon: 'codicon:folder',
        children: [
          { id: 'HelloWorld.vue', label: 'HelloWorld.vue', icon: 'mdi:vuejs' },
          { id: 'TheHeader.vue', label: 'TheHeader.vue', icon: 'mdi:vuejs' },
          { id: 'TheFooter.vue', label: 'TheFooter.vue', icon: 'mdi:vuejs' },
        ],
      },
      {
        id: 'src/composables',
        label: 'composables',
        icon: 'codicon:folder',
        children: [
          { id: 'useAuth.ts', label: 'useAuth.ts', icon: 'codicon:file-code' },
          { id: 'useFetch.ts', label: 'useFetch.ts', icon: 'codicon:file-code' },
        ],
      },
      {
        id: 'src/views',
        label: 'views',
        icon: 'codicon:folder',
        children: [
          { id: 'HomeView.vue', label: 'HomeView.vue', icon: 'mdi:vuejs' },
          { id: 'AboutView.vue', label: 'AboutView.vue', icon: 'mdi:vuejs' },
        ],
      },
      { id: 'App.vue', label: 'App.vue', icon: 'mdi:vuejs' },
      { id: 'main.ts', label: 'main.ts', icon: 'codicon:file-code' },
      { id: 'router.ts', label: 'router.ts', icon: 'codicon:file-code' },
    ],
  },
  { id: 'index.html', label: 'index.html', icon: 'codicon:file-code' },
  { id: 'package.json', label: 'package.json', icon: 'codicon:json' },
  { id: 'tsconfig.json', label: 'tsconfig.json', icon: 'codicon:json' },
  { id: 'vite.config.ts', label: 'vite.config.ts', icon: 'codicon:file-code' },
  { id: '.gitignore', label: '.gitignore', icon: 'codicon:git-commit' },
  { id: 'README.md', label: 'README.md', icon: 'codicon:markdown' },
]

// ---------------------------------------------------------------------------
// Outline Tree
// ---------------------------------------------------------------------------
export const outlineTree: TreeNode[] = [
  {
    id: 'ol-script',
    label: 'script setup',
    icon: 'codicon:symbol-namespace',
    children: [
      { id: 'ol-import-ref', label: 'import { ref }', icon: 'codicon:symbol-namespace' },
      { id: 'ol-import-router', label: 'import { useRouter }', icon: 'codicon:symbol-namespace' },
      { id: 'ol-count', label: 'count: Ref<number>', icon: 'codicon:symbol-variable' },
      { id: 'ol-increment', label: 'increment()', icon: 'codicon:symbol-method' },
    ],
  },
  {
    id: 'ol-template',
    label: 'template',
    icon: 'codicon:symbol-file',
    children: [
      { id: 'ol-div', label: 'div.app', icon: 'codicon:symbol-key' },
      { id: 'ol-header', label: 'TheHeader', icon: 'codicon:symbol-class' },
      { id: 'ol-main', label: 'main', icon: 'codicon:symbol-key' },
      { id: 'ol-footer', label: 'TheFooter', icon: 'codicon:symbol-class' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Extensions
// ---------------------------------------------------------------------------
export const extensionItems: ListItem[] = [
  { id: 'ext-vue', label: 'Vue - Official', description: 'Vue Language Features', icon: 'mdi:vuejs' },
  { id: 'ext-eslint', label: 'ESLint', description: 'Integrates ESLint', icon: 'codicon:checklist' },
  { id: 'ext-prettier', label: 'Prettier', description: 'Code formatter', icon: 'codicon:wand' },
  { id: 'ext-tailwind', label: 'Tailwind CSS IntelliSense', description: 'Autocomplete for Tailwind', icon: 'mdi:tailwind' },
  { id: 'ext-gitlens', label: 'GitLens', description: 'Git supercharged', icon: 'codicon:git-merge' },
  { id: 'ext-icons', label: 'Material Icon Theme', description: 'File icons', icon: 'codicon:symbol-color' },
]

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
export const panelTabs: TabItem[] = [
  { id: 'problems', label: 'Problems', icon: 'codicon:warning' },
  { id: 'output', label: 'Output', icon: 'codicon:output' },
  { id: 'terminal', label: 'Terminal', icon: 'codicon:terminal' },
  { id: 'debug-console', label: 'Debug Console', icon: 'codicon:debug-console' },
]

export const problemItems: ListItem[] = [
  {
    id: 'p1',
    label: "Property 'msg' is missing in type '{}'",
    description: 'HelloWorld.vue(3,1) — ts(2741)',
    icon: 'codicon:error',
  },
  {
    id: 'p2',
    label: "'count' is declared but never read",
    description: 'App.vue(5,7) — ts(6133)',
    icon: 'codicon:warning',
  },
  {
    id: 'p3',
    label: 'Unexpected console statement',
    description: 'useAuth.ts(12,3) — eslint(no-console)',
    icon: 'codicon:warning',
  },
]

export const initialTerminalLines = [
  '$ pnpm dev',
  '',
  '  VITE v7.3.1  ready in 312 ms',
  '',
  '  ->  Local:   http://localhost:5173/',
  '  ->  Network: http://192.168.1.42:5173/',
  '  ->  press h + enter to show help',
  '',
]

export const outputLines = [
  '[11:32:05] Starting compilation...',
  '[11:32:06] Found 1 error. Watching for file changes.',
  "[11:32:06] Error: Property 'msg' is missing in type '{}'",
  '[11:33:12] File change detected. Starting incremental compilation...',
  '[11:33:12] Found 0 errors. Watching for file changes.',
]

// ---------------------------------------------------------------------------
// Status Bar
// ---------------------------------------------------------------------------
export const statusBarItems: StatusBarItem[] = [
  { id: 'branch', content: 'main', align: 'left', priority: 1 },
  { id: 'sync', content: '0↓ 2↑', align: 'left', priority: 2 },
  { id: 'errors', content: '1 error', align: 'left', priority: 3 },
  { id: 'warnings', content: '2 warnings', align: 'left', priority: 4 },
  { id: 'line-col', content: 'Ln 14, Col 8', align: 'right', priority: 1 },
  { id: 'spaces', content: 'Spaces: 2', align: 'right', priority: 2 },
  { id: 'encoding', content: 'UTF-8', align: 'right', priority: 3 },
  { id: 'eol', content: 'LF', align: 'right', priority: 4 },
  { id: 'language', content: 'Vue', align: 'right', priority: 5 },
  { id: 'prettier', content: 'Prettier ✓', align: 'right', priority: 6 },
]

// ---------------------------------------------------------------------------
// Default Editor Tabs
// ---------------------------------------------------------------------------
export const defaultEditorTabs: TabItem[] = [
  { id: 'App.vue', label: 'App.vue', icon: 'mdi:vuejs', closable: true },
  { id: 'main.ts', label: 'main.ts', icon: 'codicon:file-code', closable: true },
  { id: 'HelloWorld.vue', label: 'HelloWorld.vue', icon: 'mdi:vuejs', closable: true, dirty: true },
]

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export const chatModes = ['Ask', 'Edit', 'Agent'] as const
export type ChatMode = (typeof chatModes)[number]

export const chatModels = ['Claude 3.5 Sonnet', 'GPT-4o', 'Claude 3 Opus', 'GPT-4o mini', 'o1-preview'] as const
export type ChatModel = (typeof chatModels)[number]

export const chatContexts = [
  { id: 'current-file', label: 'Current File', icon: 'codicon:file' },
  { id: 'selection', label: 'Selection', icon: 'codicon:selection' },
  { id: 'workspace', label: 'Workspace', icon: 'codicon:folder-library' },
  { id: 'terminal', label: 'Terminal', icon: 'codicon:terminal' },
  { id: 'git-changes', label: 'Git Changes', icon: 'codicon:git-commit' },
] as const

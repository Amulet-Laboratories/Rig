import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 10_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5200',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'pnpm vite dev --config e2e/vite.config.ts',
    port: 5200,
    reuseExistingServer: !process.env.CI,
  },
})

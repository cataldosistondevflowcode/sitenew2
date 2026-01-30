import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes de SEO JS-Off
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    // URL base para testes
    baseURL: process.env.BASE_URL || 'https://sitenew2.vercel.app',
    
    // Coletar trace em caso de falha
    trace: 'on-first-retry',
    
    // Screenshot em caso de falha
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-js-disabled',
      use: {
        ...devices['Desktop Chrome'],
        // Desabilitar JavaScript para simular crawlers
        javaScriptEnabled: false,
      },
    },
    {
      name: 'chromium-js-enabled',
      use: {
        ...devices['Desktop Chrome'],
        javaScriptEnabled: true,
      },
    },
  ],
});

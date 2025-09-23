import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Separate config for CI
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/__tests__/**',
        '**/index.ts',
        '**/index.tsx',
        'dist/',
        'coverage/',
        '*.config.*',
        '.eslintrc.*'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // Per-file thresholds for critical files
        'src/hooks/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/services/': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        }
      },
      // Include source files for coverage even if not tested
      all: true,
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      // Report uncovered lines
      reportOnFailure: true
    },
    // Test environment setup
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // Performance optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true
      }
    },
    
    // Test file patterns
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.d.ts'
    ],
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration
    reporter: process.env.CI ? ['verbose', 'junit'] : ['verbose'],
    outputFile: {
      junit: './coverage/junit.xml'
    },
    
    // Watch mode configuration
    watch: !process.env.CI,
    watchExclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**'
    ],
    
    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true
  }
});
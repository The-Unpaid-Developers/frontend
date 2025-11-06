// Test configuration for API URLs and other environment-specific settings
export const TEST_CONFIG = {
  // API Base URLs - use environment variables or fallback to localhost
  API_BASE_URLS: {
    CORE_SERVICE: process.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    DIAGRAM_SERVICE: process.env.VITE_DIAGRAM_API_BASE_URL || 'http://localhost:8081/api/v1',
  },
  
  // Test timeouts
  TIMEOUTS: {
    DEFAULT: 5000,
    LONG_RUNNING: 10000,
  },
  
  // Mock response delays (for testing loading states)
  MOCK_DELAYS: {
    FAST: 100,
    NORMAL: 300,
    SLOW: 1000,
  },
} as const;

// Helper to get full API URL
export const getApiUrl = (service: keyof typeof TEST_CONFIG.API_BASE_URLS, endpoint: string) => {
  const baseUrl = TEST_CONFIG.API_BASE_URLS[service];
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
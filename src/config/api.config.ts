// API Configuration
// Reads from window._env_ which is injected at runtime by Docker/K8s
// Falls back to localhost for local development

interface EnvConfig {
  CORE_SERVICE_URL?: string;
  DIAGRAM_SERVICE_URL?: string;
}

// Extend window interface to include our env config
declare global {
  interface Window {
    _env_?: EnvConfig;
  }
}

// API Base URLs - directly read from window._env_ or use defaults
export const API_CONFIG = {
  CORE_SERVICE_URL: window._env_?.CORE_SERVICE_URL || "http://localhost:8080",
  DIAGRAM_SERVICE_URL:
    window._env_?.DIAGRAM_SERVICE_URL || "http://localhost:8081",
};

// Helper to build full API URL
export const buildApiUrl = (baseUrl: string, path: string): string => {
  const cleanBase = baseUrl?.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path?.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

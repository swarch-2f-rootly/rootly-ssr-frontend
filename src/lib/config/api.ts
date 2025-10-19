// Centralized API configuration (similar to original frontend)
export const API_CONFIG = {
  // API Gateway URL - single point of entry
  GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
  
  // All services go through API Gateway
  AUTH_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
  PLANTS_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
  ANALYTICS_URL: process.env.API_GATEWAY_URL || 'http://localhost:8080',
} as const;

// Helper function to get the appropriate API URL
export const getApiUrl = (service: 'gateway' | 'auth' | 'plants' | 'analytics' = 'gateway') => {
  switch (service) {
    case 'gateway':
      return API_CONFIG.GATEWAY_URL;
    case 'auth':
      return API_CONFIG.AUTH_URL;
    case 'plants':
      return API_CONFIG.PLANTS_URL;
    case 'analytics':
      return API_CONFIG.ANALYTICS_URL;
    default:
      return API_CONFIG.GATEWAY_URL;
  }
};

// GraphQL endpoint
export const GRAPHQL_ENDPOINT = `${API_CONFIG.GATEWAY_URL}/graphql`;
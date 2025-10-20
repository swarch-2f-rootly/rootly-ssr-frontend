// Centralized API configuration (similar to original frontend)
// Use Next.js API routes as proxy to avoid CORS issues
export const API_CONFIG = {
  // API Gateway URL - use Next.js API routes as proxy
  GATEWAY_URL: '',  // Empty string for relative URLs
  
  // All services go through Next.js API routes
  AUTH_URL: '',  // Empty string for relative URLs
  PLANTS_URL: '',  // Empty string for relative URLs
  ANALYTICS_URL: '',  // Empty string for relative URLs
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
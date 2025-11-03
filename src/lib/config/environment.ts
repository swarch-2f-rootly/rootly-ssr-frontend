// Environment configuration for Rootly SSR Frontend
export const ENV_CONFIG = {
  // API Gateway Configuration
  API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://reverse_proxy:80',
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://reverse_proxy:80',
  
  // Backend Services
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://reverse_proxy:80',
  PLANTS_SERVICE_URL: process.env.PLANTS_SERVICE_URL || 'http://reverse_proxy:80',
  ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL || 'http://reverse_proxy:80',
  DATA_MANAGEMENT_SERVICE_URL: process.env.DATA_MANAGEMENT_SERVICE_URL || 'http://reverse_proxy:80',
  
  // Next.js Configuration
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://reverse_proxy:80',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // GraphQL Configuration
  GRAPHQL_PLAYGROUND_ENABLED: process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true',
  GRAPHQL_INTROSPECTION_ENABLED: process.env.GRAPHQL_INTROSPECTION_ENABLED === 'true',
  
  // CORS Configuration
  CORS_ALLOW_ALL_ORIGINS: process.env.CORS_ALLOW_ALL_ORIGINS === 'true',
  
  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',
  
  // Testing Configuration
  TEST_API_GATEWAY_URL: process.env.TEST_API_GATEWAY_URL || 'http://reverse_proxy:80',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/rootly_test',
} as const;

// Validation function
export function validateEnvironment() {
  const required = [
    'API_GATEWAY_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
}

// Development helpers
export const isDevelopment = ENV_CONFIG.IS_DEVELOPMENT;
export const isProduction = ENV_CONFIG.IS_PRODUCTION;
export const isTest = process.env.NODE_ENV === 'test';

// REST API Client using fetch (similar to original frontend)
import { API_CONFIG } from '../config/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('access_token');
  console.log('🔑 Auth token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  console.log('🔑 Headers being sent:', headers);
  return headers;
};

// Base API client using fetch
export class RestApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Handle 204 No Content or empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : undefined as T;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content or empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : undefined as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(`HTTP error! status: ${response.status}`) as Error & {
        status: number;
        statusText: string;
        responseText: string;
      };
      // Attach additional info for better error handling
      error.status = response.status;
      error.statusText = response.statusText;
      error.responseText = errorText;
      
      // Don't log 404 errors as they're expected (e.g., already deleted resources)
      if (response.status !== 404) {
        console.error(`DELETE ${endpoint} failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
      }
      
      throw error;
    }

    // Handle 204 No Content or empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    // Only parse JSON if there's content
    const text = await response.text();
    return text ? JSON.parse(text) : undefined as T;
  }
}

// Create API client instances for different services
export const plantsClient = new RestApiClient(API_CONFIG.PLANTS_URL);
export const devicesClient = new RestApiClient(API_CONFIG.PLANTS_URL); // Devices also use plants service
export const authClient = new RestApiClient(API_CONFIG.AUTH_URL);
export const analyticsClient = new RestApiClient(API_CONFIG.ANALYTICS_URL);
/**
 * Obtiene la URL base del API Gateway según el entorno
 * 
 * - En Docker: usa el nombre del servicio (api-gateway:8080)
 * - En desarrollo local: usa localhost:8080
 */
export function getApiGatewayUrl(): string {
  // Preferir BASE_URL si está definida (para Docker)
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Luego API_GATEWAY_URL
  if (process.env.API_GATEWAY_URL) {
    return process.env.API_GATEWAY_URL;
  }
  
  // Fallback para desarrollo local
  return 'http://localhost:8080';
}


/**
 * Obtiene la URL base del API Gateway según el entorno
 * 
 * - En Docker: usa el nombre del servicio (api-gateway:8080)
 * - En desarrollo local: usa localhost:8080
 */
export function getApiGatewayUrl(): string {
  const candidate =
    process.env.API_GATEWAY_URL?.trim() ??
    process.env.NEXT_PUBLIC_API_GATEWAY_URL?.trim() ??
    process.env.BASE_URL?.trim();

  if (candidate && candidate.length > 0) {
    return candidate;
  }

  // Fallback dentro de Docker: apuntar directamente al servicio api-gateway
  return 'http://api-gateway:8080';
}


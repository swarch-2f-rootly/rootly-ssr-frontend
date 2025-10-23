import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Función para obtener la URL del API Gateway
// Usar variable de entorno para mayor flexibilidad
function getApiGatewayUrl(): string {
  // En Docker, usar el nombre del servicio
  // En desarrollo local, usar localhost
  return process.env.API_GATEWAY_URL || 'http://localhost:8080';
}

// Middleware para manejar CORS y headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handler para OPTIONS (preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return setCorsHeaders(response);
}

// Handler principal para GraphQL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Headers de autenticación
    const authHeader = request.headers.get('Authorization');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const apiGatewayUrl = getApiGatewayUrl();
    const targetUrl = `${apiGatewayUrl}/api/v1/graphql`;

    console.log('GraphQL Proxy: Using API Gateway URL:', apiGatewayUrl);
    console.log('GraphQL Proxy: Target URL:', targetUrl);

    // Usar axios para manejar mejor la conexión y respuesta
    const response = await axios.post(targetUrl, body, {
      headers,
      timeout: 30000, // 30 segundos
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      validateStatus: () => true, // No lanzar error en ningún status code
      decompress: false, // Deshabilitar descompresión automática
      transitional: {
        silentJSONParsing: false,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
      },
      // Forzar IPv4 y deshabilitar HTTP agent pooling para evitar problemas de conexión
      httpAgent: new (await import('http')).Agent({
        keepAlive: false,
        family: 4, // Forzar IPv4
      }),
      // Configuración adicional para resolver problemas de DNS
      lookup: (await import('dns')).lookup,
    });

    // Devolver la respuesta tal como viene del servicio de analytics
    const nextResponse = NextResponse.json(response.data, { 
      status: response.status 
    });
    
    return setCorsHeaders(nextResponse);

  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: 'GraphQL request failed',
          message: error.message,
          code: error.code
        },
        { status: 502 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}


// Handler para GET (GraphQL Playground)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    const headers: Record<string, string> = {
      'Accept': 'text/html,application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const analyticsUrl = getApiGatewayUrl();
    const targetUrl = `${analyticsUrl}/api/v1/graphql`;

    const response = await axios.get(targetUrl, {
      headers,
      timeout: 30000,
      validateStatus: () => true,
    });

    const contentType = response.headers['content-type'];
    
    if (contentType?.includes('text/html')) {
      return new NextResponse(response.data, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const nextResponse = NextResponse.json(response.data);
    return setCorsHeaders(nextResponse);
  } catch (error) {
    console.error('GraphQL GET Error:', error);
    return NextResponse.json(
      { error: 'GraphQL Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

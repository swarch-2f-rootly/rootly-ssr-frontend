import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Función para obtener la URL del servicio de Analytics directamente
// Nota: Estamos conectando directamente al servicio de analytics para evitar
// problemas con el proxy reverso del API Gateway en Go con respuestas grandes
function getAnalyticsServiceUrl(): string {
  // En Docker: usar el nombre del servicio
  if (process.env.NODE_ENV === 'production') {
    return 'http://be-analytics:8000';
  }
  
  // En desarrollo local: usar el puerto expuesto
  return 'http://localhost:8000';
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

    const analyticsUrl = getAnalyticsServiceUrl();
    const targetUrl = `${analyticsUrl}/api/v1/graphql`;

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
      // Deshabilitar HTTP agent pooling para evitar problemas de conexión
      httpAgent: new (await import('http')).Agent({
        keepAlive: false,
      }),
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

    const analyticsUrl = getAnalyticsServiceUrl();
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

import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

// Configuración del cliente GraphQL para el API Gateway
const gatewayClient = new GraphQLClient(
  process.env.API_GATEWAY_URL + '/graphql',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

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
    const { query, variables, operationName } = body;

    // Validación básica
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Headers de autenticación (si existen)
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Ejecutar query en el API Gateway
    const result = await gatewayClient.request(
      query,
      variables,
      { ...headers }
    );

    const response = NextResponse.json(result);
    return setCorsHeaders(response);

  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'GraphQL Error',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


// Handler para GET (GraphQL Playground o queries simples)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required for GET requests' },
      { status: 400 }
    );
  }

  try {
    const result = await gatewayClient.request(query);
    const response = NextResponse.json(result);
    return setCorsHeaders(response);
  } catch (error) {
    console.error('GraphQL GET Error:', error);
    return NextResponse.json(
      { error: 'GraphQL Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

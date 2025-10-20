import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

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

    const targetUrl = new URL('/api/v1/graphql', BASE_URL);

    const response = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    return setCorsHeaders(nextResponse);

  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown' },
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

    const targetUrl = new URL('/api/v1/graphql', BASE_URL);

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    return setCorsHeaders(nextResponse);
  } catch (error) {
    console.error('GraphQL GET Error:', error);
    return NextResponse.json(
      { error: 'GraphQL Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

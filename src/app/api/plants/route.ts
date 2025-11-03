import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL || 'http://reverse_proxy:80';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    // Construir la URL de destino en la API Gateway
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const targetUrl = new URL(`/api/v1/plants${searchParams ? `?${searchParams}` : ''}`, BASE_URL);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Hacer la petición a la API Gateway
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying plants GET to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    console.log('🌱 POST /api/plants - Auth header:', authHeader ? 'YES' : 'NO');
    console.log('🌱 POST /api/plants - Body:', body);

    const targetUrl = new URL('/api/v1/plants', BASE_URL);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('🌱 Forwarding to API Gateway:', targetUrl.toString());
    console.log('🌱 Headers:', headers);

    const response = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log('🌱 API Gateway response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('🌱 API Gateway error:', errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🌱 Plant created successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying plant creation to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

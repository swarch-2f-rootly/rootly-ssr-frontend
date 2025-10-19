import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Try to get plants from API Gateway
    try {
      const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8080';
      const response = await fetch(`${apiGatewayUrl}/api/v1/plants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (apiError) {
      console.log('API Gateway not available for plants, using mock data');
    }

    // Fallback to mock plants data
    const mockPlants = [
      {
        id: '1',
        name: 'Tomate Cherry',
        species: 'Solanum lycopersicum',
        description: 'Tomate cherry orgánico cultivado en invernadero',
        user_id: '1',
        photo_filename: 'tomate-cherry.jpg',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Lechuga Romana',
        species: 'Lactuca sativa',
        description: 'Lechuga romana fresca para ensaladas',
        user_id: '1',
        photo_filename: 'lechuga-romana.jpg',
        created_at: '2024-01-20T14:15:00Z',
        updated_at: '2024-01-20T14:15:00Z',
      },
    ];

    return NextResponse.json(mockPlants);
  } catch (error) {
    console.error('Plants API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to create plant through API Gateway
    try {
      const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8080';
      const response = await fetch(`${apiGatewayUrl}/api/v1/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (apiError) {
      console.log('API Gateway not available for plant creation, using mock response');
    }

    // Fallback to mock plant creation
    const newPlant = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(newPlant);
  } catch (error) {
    console.error('Plant creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

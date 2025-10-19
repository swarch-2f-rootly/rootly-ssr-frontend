import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Try to get user plants from API Gateway
    try {
      const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8080';
      const response = await fetch(`${apiGatewayUrl}/api/v1/plants/users/${userId}`, {
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
      console.log('API Gateway not available for user plants, using mock data');
    }

    // Fallback to mock user plants data
    const mockUserPlants = [
      {
        id: '1',
        name: 'Tomate Cherry',
        species: 'Solanum lycopersicum',
        description: 'Tomate cherry orgánico cultivado en invernadero',
        user_id: userId,
        photo_filename: 'tomate-cherry.jpg',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Lechuga Romana',
        species: 'Lactuca sativa',
        description: 'Lechuga romana fresca para ensaladas',
        user_id: userId,
        photo_filename: 'lechuga-romana.jpg',
        created_at: '2024-01-20T14:15:00Z',
        updated_at: '2024-01-20T14:15:00Z',
      },
    ];

    return NextResponse.json(mockUserPlants);
  } catch (error) {
    console.error('User plants API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

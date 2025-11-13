import { NextRequest, NextResponse } from 'next/server';
import { getApiGatewayUrl } from '@/lib/utils/api-url';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; deviceId: string }> }
) {
  try {
    const { userId, deviceId } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(
      `/api/v1/devices/users/${userId}/devices/${deviceId}`,
      getApiGatewayUrl()
    );

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    // Return 204 No Content or the response data
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL || 'http://reverse_proxy:80';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const { plantId } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(`/api/v1/plants/${plantId}`, BASE_URL);

    const forwardedHeaders = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (authHeader) {
      forwardedHeaders.set('Authorization', authHeader);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: forwardedHeaders,
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
    console.error('Error proxying to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const { plantId } = await params;
    const body = await request.json();

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(`/api/v1/plants/${plantId}`, BASE_URL);

    const forwardedHeaders = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (authHeader) {
      forwardedHeaders.set('Authorization', authHeader);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'PUT',
      headers: forwardedHeaders,
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const { plantId } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(`/api/v1/plants/${plantId}`, BASE_URL);

    const forwardedHeaders = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (authHeader) {
      forwardedHeaders.set('Authorization', authHeader);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'DELETE',
      headers: forwardedHeaders,
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


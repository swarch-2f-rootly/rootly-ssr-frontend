import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL || 'http://reverse-proxy:80';

async function proxyRequest(
  url: URL,
  init: RequestInit
): Promise<Response> {
  return fetch(url.toString(), init);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const { plantId } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(`/api/v1/plants/${plantId}/photo`, BASE_URL);

    const forwardedHeaders = new Headers({
      'Accept': 'image/*',
    });

    if (authHeader) {
      forwardedHeaders.set('Authorization', authHeader);
    }

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: forwardedHeaders,
    };

    let response = await proxyRequest(targetUrl, fetchOptions);

    if (!response.ok) {
      // Intentar directamente contra el servicio de plantas
      const directResponse = await proxyRequest(targetUrl, fetchOptions);
      if (!directResponse.ok) {
        const status = directResponse.status || response.status || 500;
        return NextResponse.json(
          { error: 'Failed to fetch plant photo' },
          { status }
        );
      }
      response = directResponse;
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error proxying plant photo to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const { plantId } = await params;

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');

    const targetUrl = new URL(`/api/v1/plants/${plantId}/photo`, BASE_URL);

    // Forward the FormData directly
    const formData = await request.formData();

    const forwardedHeaders = new Headers();
    if (authHeader) {
      forwardedHeaders.set('Authorization', authHeader);
    }

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: forwardedHeaders,
      body: formData,
    };

    let response = await proxyRequest(targetUrl, fetchOptions);

    if (!response.ok) {
      const directResponse = await proxyRequest(targetUrl, fetchOptions);
      if (!directResponse.ok) {
        const errorText = await directResponse
          .text()
          .catch(() => 'Unknown error');
        return NextResponse.json(
          { error: errorText },
          { status: directResponse.status }
        );
      }
      response = directResponse;
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error proxying plant photo upload to API Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


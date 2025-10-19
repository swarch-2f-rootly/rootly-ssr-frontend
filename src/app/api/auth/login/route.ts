import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try to authenticate through API Gateway first
    try {
      const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8080';
      console.log('🔐 Attempting login via API Gateway:', `${apiGatewayUrl}/api/v1/auth/login`);
      
      const response = await fetch(`${apiGatewayUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔐 API Gateway response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔐 Login successful via API Gateway');
        // Normalizar la respuesta al formato esperado por el frontend
        return NextResponse.json({
          success: true,
          user: data.user,
          token: data.access_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token,
        });
      } else {
        const errorText = await response.text();
        console.log('🔐 API Gateway login failed:', response.status, errorText);
      }
    } catch (apiError) {
      console.error('🔐 API Gateway login request failed:', apiError);
      return NextResponse.json({ error: 'Login service unavailable' }, { status: 502 });
    }

    // Credenciales incorrectas
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

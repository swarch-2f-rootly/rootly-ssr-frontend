import { NextRequest, NextResponse } from 'next/server';
import { getApiGatewayUrl } from '@/lib/utils/api-url';

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
    const apiGatewayUrl = getApiGatewayUrl();
    const directAuthUrl = process.env.AUTH_SERVICE_URL || 'http://be-authentication-and-roles:8000';

    // Intentar autenticación vía API Gateway (reverse-proxy)
    try {
      console.log('🔐 Attempting login via API Gateway:', `${apiGatewayUrl}/api/v1/auth/login`);
      
      const response = await fetch(`${apiGatewayUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔐 API Gateway response status:', response.status);
      
      if (response.ok && response.status < 500) {
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
        if (response.status >= 400 && response.status < 500) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
      }
    } catch (apiError) {
      console.error('🔐 API Gateway login request failed:', apiError);
    }

    // Fallback al servicio de autenticación directo (bypass API Gateway)
    try {
      console.log('🔐 Falling back to Auth Service:', `${directAuthUrl}/api/v1/auth/login`);
      const response = await fetch(`${directAuthUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔐 Login successful via Auth Service fallback');
        return NextResponse.json({
          success: true,
          user: data.user,
          token: data.access_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token,
        });
      }

      if (response.status === 401) {
        const detail = await response.text();
        console.log('🔐 Auth Service invalid credentials:', detail);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const errorText = await response.text();
      console.error('🔐 Auth Service fallback error:', response.status, errorText);
      return NextResponse.json({ error: 'Login service unavailable' }, { status: 502 });
    } catch (fallbackError) {
      console.error('🔐 Auth Service fallback request failed:', fallbackError);
      return NextResponse.json({ error: 'Login service unavailable' }, { status: 502 });
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simulate authentication logic
    // In a real app, you would validate against a database
    if (email === 'demo@example.com' && password === 'password123') {
      // Simulate 2FA requirement for certain users
      if (email === 'demo@example.com') {
        return NextResponse.json({
          requires2FA: true,
          message: 'Please enter your 2FA code',
        });
      }

      // Generate a mock JWT token (in real app, use proper JWT library)
      const token = 'mock_jwt_token_' + Date.now();
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: '1',
          email,
          name: 'Demo User',
          isEmailVerified: true,
          has2FA: false,
        },
      });
    }

    // Invalid credentials
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
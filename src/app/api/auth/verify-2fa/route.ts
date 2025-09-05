import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Basic validation
    if (!code) {
      return NextResponse.json(
        { message: '2FA code is required' },
        { status: 400 }
      );
    }

    // Simulate 2FA code validation
    // In a real app, you would verify against TOTP or stored backup codes
    const validCodes = ['123456', '654321']; // Mock valid 2FA codes
    const validBackupCodes = ['12345678', '87654321']; // Mock backup codes
    
    const isValidCode = validCodes.includes(code) || validBackupCodes.includes(code);
    
    if (!isValidCode) {
      return NextResponse.json(
        { message: 'Invalid 2FA code' },
        { status: 400 }
      );
    }

    // Generate mock JWT token
    const token = 'mock_jwt_2fa_token_' + Date.now();
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        isEmailVerified: true,
        has2FA: true,
      },
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
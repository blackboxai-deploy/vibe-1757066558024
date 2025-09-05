import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate checking if user exists
    // In a real app, you would check your database
    const userExists = email === 'demo@example.com' || email.endsWith('@example.com');
    
    if (!userExists) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a reset code.',
      });
    }

    // Simulate sending reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, you would:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset code/link
    
    console.log(`Reset code for ${email}: ${resetCode}`);
    
    return NextResponse.json({
      success: true,
      message: 'Reset code sent to your email address.',
      // In development, you might want to return the code for testing
      ...(process.env.NODE_ENV === 'development' && { resetCode }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
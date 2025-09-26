import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  console.log(`Registering user with email: ${email}`);
  const userId = `USER-${Date.now()}`;
  return NextResponse.json({ success: true, userId, message: 'User registered successfully. Please verify your email.' });
}

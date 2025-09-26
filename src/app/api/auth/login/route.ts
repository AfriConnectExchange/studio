import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  console.log(`Logging in user with email: ${email}`);
  return NextResponse.json({ success: true, userId: 'USER-123', token: 'fake-jwt-token', message: 'Login successful.' });
}

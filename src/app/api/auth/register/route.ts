
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  // const supabase = createClient();

  // // Sign up the user in Supabase auth
  // const { data: authData, error: authError } = await supabase.auth.signUp({
  //   email,
  //   password,
  //   options: {
  //     data: {
  //       full_name: name,
  //     },
  //   },
  // });

  // if (authError) {
  //   return NextResponse.json({ message: authError.message }, { status: 400 });
  // }

  // if (!authData.user) {
  //   return NextResponse.json({ message: 'User not created, but no error received.' }, { status: 500 });
  // }
  
  // // Immediately create a corresponding profile in the public.profiles table
  // const { error: profileError } = await supabase.from('profiles').insert({
  //   id: authData.user.id,
  //   full_name: name,
  //   role_id: 1, // Default role to 'buyer'
  //   onboarding_completed: false, // Ensure onboarding is required
  // });
  
  // if (profileError) {
  //   // This is a critical issue. The auth user was created, but the profile wasn't.
  //   // In a production app, you might want to automatically delete the auth user here
  //   // to allow them to try signing up again cleanly.
  //   console.error('CRITICAL: Failed to create profile for new user:', profileError.message);
  //   // For now, we inform the user, but this state requires manual cleanup or more robust logic.
  //   return NextResponse.json(
  //       { message: `User authenticated but failed to create profile: ${profileError.message}` },
  //       { status: 500 }
  //   );
  // }
  
  console.log(`Simulating registration for email: ${email}`);

  return NextResponse.json({
    message: 'User registered successfully. Please check your email for verification.',
    user: { id: 'simulated-user-id', email: email },
  }, { status: 201 });
}

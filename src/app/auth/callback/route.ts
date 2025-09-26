import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      const user = session.user;
      
      // Check if a profile exists for the user.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error("Error checking for profile:", profileError);
      }
      
      // If no profile exists, create one. This is for social logins.
      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          role_id: 1, // Default to 'buyer'
          onboarding_completed: false,
        });

        if (insertError) {
          console.error("Error creating profile for social login:", insertError);
          // Redirect to an error page as the user state is inconsistent
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }
        // New user, redirect to onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      
      // Existing user, redirect to marketplace or wherever 'next' points
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

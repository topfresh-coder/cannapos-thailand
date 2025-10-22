// Create test user via Supabase Auth API
// This properly creates the user in auth schema with all required fields

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTestUser() {
  try {
    console.log('Creating test user in Supabase Auth...');

    // Sign up creates the user in auth.users automatically
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@cannapos.local',
      password: 'testpass123',
      options: {
        data: {
          name: 'Test Cashier'
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return;
    }

    console.log('✅ User created in auth.users:', authData.user?.id);

    // Now create the corresponding record in public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: 'test@cannapos.local',
        name: 'Test Cashier',
        role: 'cashier',
        location_id: '00000000-0000-0000-0000-000000000001'
      }, {
        onConflict: 'id'
      });

    if (userError) {
      console.error('Public users table error:', userError);
      return;
    }

    console.log('✅ User created in public.users');
    console.log('\nTest credentials:');
    console.log('Email: test@cannapos.local');
    console.log('Password: testpass123');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();

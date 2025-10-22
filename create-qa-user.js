// Create QA Test User for Story 1.5 Testing
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createQAUser() {
  console.log('🧪 Creating QA Test User for Story 1.5...\n');

  try {
    // First, check if user already exists and delete if so
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(u => u.email === 'qa-tester@cannapos.test');

    if (existing) {
      console.log('⚠️  User already exists, deleting old user...');
      await supabase.auth.admin.deleteUser(existing.id);
      console.log('✓ Old user deleted\n');
    }

    // Create new auth user
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'qa-tester@cannapos.test',
      password: 'QATest2025!',
      email_confirm: true,
      user_metadata: {
        name: 'QA Test User'
      }
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError);
      process.exit(1);
    }

    console.log('✓ Auth user created:', authData.user.id);

    // Get first location
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('id, name')
      .limit(1)
      .single();

    if (locError || !locations) {
      console.error('❌ Error getting location:', locError);
      process.exit(1);
    }

    console.log('✓ Location found:', locations.name);

    // Delete existing user profile if exists
    await supabase.from('users').delete().eq('id', authData.user.id);

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'qa-tester@cannapos.test',
        name: 'QA Test User',
        role: 'cashier',
        location_id: locations.id
      });

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError);
      process.exit(1);
    }

    console.log('✓ User profile created\n');
    console.log('═══════════════════════════════════════');
    console.log('🎉 QA Test User Created Successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\nTest Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Email:    qa-tester@cannapos.test');
    console.log('Password: QATest2025!');
    console.log('─────────────────────────────────────');
    console.log('User ID:  ', authData.user.id);
    console.log('Location: ', locations.name);
    console.log('Role:     cashier');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

createQAUser();

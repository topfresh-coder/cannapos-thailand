import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormValues } from '@/utils/validation';
import { getAuthErrorMessage } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { AuthError } from '@supabase/supabase-js';

/**
 * Login Page Component
 *
 * Displays the authentication login form with email and password fields.
 * Handles form validation, error display, and navigation after successful login.
 *
 * Features:
 * - Form validation with Zod schema
 * - Real-time field-level error messages
 * - Toast notifications for auth errors
 * - Loading states during submission
 * - Auto-redirect if already authenticated
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Redirect to POS if already logged in
  useEffect(() => {
    console.log('[LoginPage] Auth state changed:', {
      hasUser: !!user,
      authLoading,
      shouldNavigate: user && !authLoading,
    });

    if (user && !authLoading) {
      console.log('[LoginPage] Navigating to /pos');
      navigate('/pos', { replace: true });
    }
  }, [user, authLoading, navigate]);

  /**
   * Handle form submission
   *
   * Attempts to sign in with provided credentials.
   * On success: navigates to /pos
   * On error: displays toast notification with user-friendly message
   */
  const onSubmit = async (values: LoginFormValues) => {
    console.log('[LoginPage] onSubmit called for email:', values.email);
    try {
      console.log('[LoginPage] Calling signIn...');
      await signIn(values.email, values.password);
      console.log('[LoginPage] signIn completed, waiting for navigation...');
      // Navigation handled by useEffect after auth state updates
    } catch (error) {
      console.error('[LoginPage] signIn failed:', error);
      // Display user-friendly error message
      const errorMessage = getAuthErrorMessage(error as AuthError);

      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: errorMessage,
      });

      // Also set form-level error for screen readers
      form.setError('root', {
        message: errorMessage,
      });
    }
  };

  // Show loading state while checking initial auth status
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access the POS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form-level error message (for screen readers) */}
              {form.formState.errors.root && (
                <div
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Placeholder for future features */}
              <div className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed opacity-50 hover:no-underline"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

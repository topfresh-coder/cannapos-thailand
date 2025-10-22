import { z } from 'zod';

/**
 * Login Form Validation Schema
 *
 * Validates email and password fields for the authentication login form.
 * Used with React Hook Form + Zod resolver for type-safe form validation.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Inferred TypeScript type from loginSchema
 * Use this type for form values in React Hook Form
 */
export type LoginFormValues = z.infer<typeof loginSchema>;

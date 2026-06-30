const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    providerToken: z.string().min(1, 'Provider token is required'),
  }),
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name is required'),
    role: z.enum(['OWNER', 'TENANT']),
    phone: z.string().optional(),
    providerToken: z.string().min(1, 'Provider token is required'),
  }),
});

module.exports = { loginSchema, registerSchema };

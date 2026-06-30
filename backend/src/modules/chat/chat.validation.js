const { z } = require('zod');

const chatIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid chat ID format'),
  }),
});

const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50), // History chunks
  }),
});

module.exports = { chatIdParamSchema, paginationSchema };

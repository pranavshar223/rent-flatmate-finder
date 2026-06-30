const { z } = require('zod');

const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),
});

const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.string().min(1),
    reason: z.string().min(5).optional(),
  }),
});

module.exports = { uuidParamSchema, paginationSchema, updateStatusSchema };

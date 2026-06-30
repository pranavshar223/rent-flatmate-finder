const { z } = require('zod');

const createInterestSchema = z.object({
  body: z.object({
    roomId: z.string().uuid('Invalid room ID format'),
  }),
});

const interestIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid interest ID format'),
  }),
});

const filterInterestSchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});

module.exports = { createInterestSchema, interestIdParamSchema, filterInterestSchema };

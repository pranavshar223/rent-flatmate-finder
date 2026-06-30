const { z } = require('zod');

const roomIdParamSchema = z.object({
  params: z.object({
    roomId: z.string().uuid('Invalid room ID format'),
  }),
});

const recalculateSchema = z.object({
  body: z.object({
    tenantId: z.string().uuid().optional(),
    roomId: z.string().uuid().optional(),
  }).refine(data => data.tenantId || data.roomId, {
    message: 'Either tenantId or roomId must be provided.',
  }),
});

module.exports = { roomIdParamSchema, recalculateSchema };

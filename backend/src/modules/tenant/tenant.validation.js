const { z } = require('zod');

const createProfileSchema = z.object({
  body: z.object({
    preferredLocation: z.string().min(2, 'Location is required'),
    minBudget: z.coerce.number().min(0, 'Minimum budget must be at least 0'),
    maxBudget: z.coerce.number().min(0, 'Maximum budget must be at least 0'),
    moveInDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate >= today;
    }, { message: 'Move-in date cannot be in the past' }),
  }).refine(data => data.maxBudget >= data.minBudget, {
    message: 'Max budget must be greater than or equal to min budget',
    path: ['maxBudget'], 
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    preferredLocation: z.string().min(2).optional(),
    minBudget: z.coerce.number().min(0).optional(),
    maxBudget: z.coerce.number().min(0).optional(),
    moveInDate: z.string().optional(),
  }).refine(data => {
    if (data.minBudget !== undefined && data.maxBudget !== undefined) {
      return data.maxBudget >= data.minBudget;
    }
    return true;
  }, {
    message: 'Max budget must be greater than or equal to min budget',
    path: ['maxBudget'],
  }),
});

const roomFilterSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    minBudget: z.coerce.number().optional(),
    maxBudget: z.coerce.number().optional(),
    roomType: z.enum(['SINGLE', 'DOUBLE', 'SHARED']).optional(),
    furnishing: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(['newest', 'rent_asc', 'rent_desc']).default('newest'),
  }),
});

module.exports = { createProfileSchema, updateProfileSchema, roomFilterSchema };

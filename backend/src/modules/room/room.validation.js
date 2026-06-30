const { z } = require('zod');

const createRoomSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    location: z.string().min(2, 'Location must be at least 2 characters long'),
    rent: z.coerce.number().positive('Rent must be a positive number'),
    roomType: z.enum(['SINGLE', 'DOUBLE', 'SHARED']),
    furnishingStatus: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']),
    availableFrom: z.string().refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate >= today;
    }, { message: 'Available date cannot be in the past' }),
  }),
});

const updateRoomSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    location: z.string().min(2).optional(),
    rent: z.coerce.number().positive().optional(),
    roomType: z.enum(['SINGLE', 'DOUBLE', 'SHARED']).optional(),
    furnishingStatus: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']).optional(),
    availableFrom: z.string().optional(),
  }),
});

const roomIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid room ID format'),
  }),
});

module.exports = { createRoomSchema, updateRoomSchema, roomIdParamSchema };

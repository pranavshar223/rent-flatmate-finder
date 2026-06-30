const express = require('express');
const CompatibilityController = require('./compatibility.controller');
const validate = require('../../middlewares/validate.middleware');
const { roomIdParamSchema, recalculateSchema } = require('./compatibility.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');

const router = express.Router();

router.use(requireAuth);

// Tenant endpoint to get cached score
router.get('/:roomId', requireRole('TENANT'), validate(roomIdParamSchema), catchAsync(CompatibilityController.getRoomCompatibility));

// Admin endpoint to manually trigger recalculation
router.post('/recalculate', requireRole('ADMIN'), validate(recalculateSchema), catchAsync(CompatibilityController.recalculate));

module.exports = router;

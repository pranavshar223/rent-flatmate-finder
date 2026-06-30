const express = require('express');
const TenantController = require('./tenant.controller');
const validate = require('../../middlewares/validate.middleware');
const { createProfileSchema, updateProfileSchema, roomFilterSchema } = require('./tenant.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');

const router = express.Router();

// All routes require Authentication and TENANT role
router.use(requireAuth, requireRole('TENANT'));

router.post('/profile', validate(createProfileSchema), catchAsync(TenantController.createProfile));
router.get('/profile', catchAsync(TenantController.getProfile));
router.put('/profile', validate(updateProfileSchema), catchAsync(TenantController.updateProfile));
router.get('/rooms', validate(roomFilterSchema), catchAsync(TenantController.browseRooms));

module.exports = router;

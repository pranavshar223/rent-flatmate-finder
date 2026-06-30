const express = require('express');
const AdminController = require('./admin.controller');
const validate = require('../../middlewares/validate.middleware');
const { uuidParamSchema, paginationSchema } = require('./admin.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');

const router = express.Router();

// All Admin routes require Authentication and ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

// Dashboard Analytics
router.get('/dashboard', catchAsync(AdminController.getDashboardMetrics));

// User Management
router.get('/users', validate(paginationSchema), catchAsync(AdminController.getUsers));
router.delete('/users/:id', validate(uuidParamSchema), catchAsync(AdminController.deleteUser));

// Room Moderation
router.get('/rooms', validate(paginationSchema), catchAsync(AdminController.getRooms));
router.delete('/rooms/:id', validate(uuidParamSchema), catchAsync(AdminController.deleteRoom));

module.exports = router;

const express = require('express');
const InterestController = require('./interest.controller');
const validate = require('../../middlewares/validate.middleware');
const { createInterestSchema, interestIdParamSchema, filterInterestSchema } = require('./interest.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');

const router = express.Router();

router.use(requireAuth);

// Tenant Routes
router.post('/', requireRole('TENANT'), validate(createInterestSchema), catchAsync(InterestController.createInterest));
router.get('/me', requireRole('TENANT'), validate(filterInterestSchema), catchAsync(InterestController.getTenantRequests));
router.delete('/:id', requireRole('TENANT'), validate(interestIdParamSchema), catchAsync(InterestController.cancelRequest));

// Owner Routes
router.get('/owner', requireRole('OWNER'), validate(filterInterestSchema), catchAsync(InterestController.getOwnerRequests));
router.patch('/:id/accept', requireRole('OWNER'), validate(interestIdParamSchema), catchAsync(InterestController.acceptRequest));
router.patch('/:id/reject', requireRole('OWNER'), validate(interestIdParamSchema), catchAsync(InterestController.rejectRequest));

// Shared Route (Service handles role-based authorization check)
router.get('/:id', validate(interestIdParamSchema), catchAsync(InterestController.getRequestById));

module.exports = router;

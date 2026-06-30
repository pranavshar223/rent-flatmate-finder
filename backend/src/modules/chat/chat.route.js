const express = require('express');
const ChatController = require('./chat.controller');
const validate = require('../../middlewares/validate.middleware');
const { chatIdParamSchema, paginationSchema } = require('./chat.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');

const router = express.Router();

// All chat routes require authentication (both Tenants and Owners can chat)
router.use(requireAuth);

router.get('/', catchAsync(ChatController.getUserChats));
router.get('/:id', validate(chatIdParamSchema), catchAsync(ChatController.getChatDetails));
router.get('/:id/messages', validate(chatIdParamSchema), validate(paginationSchema), catchAsync(ChatController.getChatMessages));

module.exports = router;

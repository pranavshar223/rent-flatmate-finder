const express = require('express');
const RoomController = require('./room.controller');
const validate = require('../../middlewares/validate.middleware');
const { createRoomSchema, updateRoomSchema, roomIdParamSchema } = require('./room.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.post('/', requireRole('OWNER'), upload.array('images', 10), validate(createRoomSchema), catchAsync(RoomController.createRoom));
router.get('/my', requireRole('OWNER'), catchAsync(RoomController.getOwnerRooms));
router.get('/:id', requireRole('OWNER', 'TENANT'), validate(roomIdParamSchema), catchAsync(RoomController.getRoomById));
router.put('/:id', requireRole('OWNER'), validate(roomIdParamSchema), validate(updateRoomSchema), catchAsync(RoomController.updateRoom));
router.patch('/:id/fill', requireRole('OWNER'), validate(roomIdParamSchema), catchAsync(RoomController.markAsFilled));
router.delete('/:id', requireRole('OWNER'), validate(roomIdParamSchema), catchAsync(RoomController.deleteRoom));

module.exports = router;

const express = require('express');
const RoomController = require('./room.controller');
const validate = require('../../middlewares/validate.middleware');
const { createRoomSchema, updateRoomSchema, roomIdParamSchema } = require('./room.validation');
const catchAsync = require('../../shared/utils/catchAsync');
const requireAuth = require('../../middlewares/auth.middleware');
const requireRole = require('../../middlewares/role.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// Route Protection: Every route must pass through Authentication & Role Middleware (OWNER)
router.use(requireAuth, requireRole('OWNER'));

router.post('/', upload.array('images', 10), validate(createRoomSchema), catchAsync(RoomController.createRoom));
router.get('/my', catchAsync(RoomController.getOwnerRooms));
router.get('/:id', validate(roomIdParamSchema), catchAsync(RoomController.getRoomById));
router.put('/:id', validate(roomIdParamSchema), validate(updateRoomSchema), catchAsync(RoomController.updateRoom));
router.patch('/:id/fill', validate(roomIdParamSchema), catchAsync(RoomController.markAsFilled));
router.delete('/:id', validate(roomIdParamSchema), catchAsync(RoomController.deleteRoom));

module.exports = router;

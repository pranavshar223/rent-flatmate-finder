const express = require('express');
const AuthController = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { loginSchema, registerSchema } = require('./auth.validation');
const catchAsync = require('../../shared/utils/catchAsync');

const router = express.Router();

router.post('/login', validate(loginSchema), catchAsync(AuthController.login));
router.post('/register', validate(registerSchema), catchAsync(AuthController.register));

module.exports = router;

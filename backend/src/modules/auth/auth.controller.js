const AuthService = require('./auth.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class AuthController {
  static async login(req, res) {
    const { email, providerToken } = req.body;
    
    const result = await AuthService.login(email, providerToken);

    if (result.needsRegistration) {
      // 202 Accepted: indicates request was received but further action (role selection) is required
      return res.status(202).json({
        success: true,
        message: 'ROLE_REQUIRED',
        data: { email }
      });
    }

    return ApiResponse.success(res, 200, 'Login successful', {
      user: result.user,
      token: result.token,
    });
  }

  static async register(req, res) {
    const result = await AuthService.register(req.body);

    return ApiResponse.success(res, 201, 'Registration successful', {
      user: result.user,
      token: result.token,
    });
  }
}

module.exports = AuthController;

const jwt = require('jsonwebtoken');
const supabase = require('../../providers/supabase.provider');
const UserRepository = require('../../repositories/user.repository');
const { AuthenticationError } = require('../../shared/errors');
const env = require('../../config/env');
const bcrypt = require('bcrypt');
const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');

class AuthService {
  /**
   * Verify Supabase access token directly with Supabase.
   */
  static async verifySupabaseUser(token) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Supabase getUser error:', error);
    }
    if (error || !data.user) {
      throw new AuthenticationError(`Invalid or expired authentication token: ${error?.message || 'No user data'}`);
    }
    return data.user;
  }

  static generateJwt(user) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  static async login(email, providerToken) {
    // 1. Verify token with Supabase
    const supabaseUser = await this.verifySupabaseUser(providerToken);
    
    if (supabaseUser.email !== email) {
      throw new AuthenticationError('Token email does not match provided email.');
    }

    // Extract avatarUrl if available from Google
    const avatarUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null;

    // 2. Check if user exists in DB
    let user = await UserRepository.findByEmail(email);

    // 3. If no user, prompt for role selection
    if (!user) {
      return { needsRegistration: true, user: null, token: null };
    }

    // Update avatarUrl if it has changed
    if (avatarUrl && user.avatarUrl !== avatarUrl) {
      user = await UserRepository.update(user.id, { avatarUrl });
    }

    // 4. Generate custom JWT
    const token = this.generateJwt(user);
    return { needsRegistration: false, user, token };
  }

  static async register(userData) {
    const { email, name, role, phone, providerToken } = userData;

    // 1. Verify token again
    const supabaseUser = await this.verifySupabaseUser(providerToken);
    if (supabaseUser.email !== email) {
      throw new AuthenticationError('Token email does not match provided email.');
    }

    const avatarUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null;

    // 2. Check if already registered
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const token = this.generateJwt(existingUser);
      return { user: existingUser, token };
    }

    // 3. Create user in DB (placeholder password for OAuth)
    const hashedPassword = await bcrypt.hash(email + env.JWT_SECRET, 10); 

    const newUser = await UserRepository.create({
      email,
      name,
      role,
      phone,
      avatarUrl,
      password: hashedPassword,
    });

    // 4. Trigger notifications
    eventEmitter.emit(EVENTS.USER_REGISTERED, { userId: newUser.id });

    // 5. Generate custom JWT
    const token = this.generateJwt(newUser);
    return { user: newUser, token };
  }
}

module.exports = AuthService;

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Auth = {
  /**
   * Encrypts password to store in db
   * @param password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  },

  /**
   * Compare inserted password with encrypted stored password
   * @param hashPassword
   * @param password
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
   * Validates email address
   * @param email
   * @returns {boolean}
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  /**
   * Generates token for users
   * @param id
   * @param is_admin
   * @returns {*}
   */
  // eslint-disable-next-line camelcase
  generateToken(id, is_admin) {
    const token = jwt.sign({
      userId: id,
      isAdmin: is_admin,
    },
    process.env.JWT_SECRET, { expiresIn: '3d' });
    return token;
  },
};

export default Auth;

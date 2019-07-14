import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Auth = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

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

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Authentication = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.JWT_SECRET, { expiresIn: '3d' });
    return token;
  },
};

export default Authentication;

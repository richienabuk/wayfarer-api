import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Auth = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  },

  // async hashPassword(password) {
  //   const encryptedPassword = await bcrypt(password, bcrypt.genSalt(12));
  //   return encryptedPassword;
  // },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  // async comparePassword(hashPassword, password) {
  //   const compPassword = await bcrypt.compare(password, hashPassword);
  //   return compPassword;
  // },

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

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var Auth = {
  hashPassword: function hashPassword(password) {
    return _bcrypt["default"].hashSync(password, _bcrypt["default"].genSaltSync(12));
  },
  comparePassword: function comparePassword(hashPassword, password) {
    return _bcrypt["default"].compareSync(password, hashPassword);
  },
  isValidEmail: function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  // eslint-disable-next-line camelcase
  generateToken: function generateToken(id, is_admin) {
    var token = _jsonwebtoken["default"].sign({
      userId: id,
      isAdmin: is_admin
    }, process.env.JWT_SECRET, {
      expiresIn: '3d'
    });

    return token;
  }
};
var _default = Auth;
exports["default"] = _default;
//# sourceMappingURL=AuthHelper.js.map
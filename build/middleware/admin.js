"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// eslint-disable-next-line consistent-return
var _default = function _default(req, res, next) {
  /**
   * Check if logged in user is admin
   */
  if (!req.user.isAdmin) return res.status(403).send({
    status: 'error',
    error: 'Access denied'
  });
  next();
};

exports["default"] = _default;
//# sourceMappingURL=admin.js.map
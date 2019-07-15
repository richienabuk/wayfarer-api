"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _admin = _interopRequireDefault(require("../middleware/admin"));

var _User = _interopRequireDefault(require("../controllers/User"));

var _Bus = _interopRequireDefault(require("../controllers/Bus"));

var _Trip = _interopRequireDefault(require("../controllers/Trip"));

var _Booking = _interopRequireDefault(require("../controllers/Booking"));

var router = _express["default"].Router();

var _default = function _default(app) {
  app.use(_express["default"].json());
  app.use(_express["default"].urlencoded({
    extended: false
  })); // User Auth endpoints

  router.post('/auth/signup', _User["default"].register);
  router.post('/auth/signin', _User["default"].login);
  router.get('/auth', _User["default"].index); // Bus endpoints

  router.post('/buses', [_auth["default"], _admin["default"]], _Bus["default"].create);
  router.get('/buses', [_auth["default"], _admin["default"]], _Bus["default"].index); // Trip endpoints

  router.post('/trips', [_auth["default"], _admin["default"]], _Trip["default"].create);
  router.get('/trips', _auth["default"], _Trip["default"].index); // router.get('/trips/:id', auth, Trip.show);

  router.put('/trips/:id', [_auth["default"], _admin["default"]], _Trip["default"].update);
  router.post('/bookings', _auth["default"], _Booking["default"].create);
  router.get('/bookings', _auth["default"], _Booking["default"].index);
  router.get('/bookings/:id', _auth["default"], _Booking["default"].show);
  router.put('/bookings/:id', _auth["default"], _Booking["default"].update);
  router["delete"]('/bookings/:id', _auth["default"], _Booking["default"]["delete"]);
  app.use('/api/v1', router);
};

exports["default"] = _default;
//# sourceMappingURL=index.js.map
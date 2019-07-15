"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var config = {
  user: process.env.DB_USERNAME || 'postgres',
  database: process.env.DATABASE || 'wayfarer',
  password: process.env.DB_PASSWORD || 'enthusiast',
  port: process.env.DB_PORT || 5432,
  max: process.env.DB_MAX || 10,
  // max number of clients in the pool
  idleTimeoutMillis: process.env.DB_TIMEOUT || 30000
};
var _default = config;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
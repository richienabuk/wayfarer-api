"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = _interopRequireDefault(require("pg"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config(); // import config from '../config';
// const pool = new pg.Pool(config);


var pool = new _pg["default"].Pool({
  connectionString: process.env.DATABASE_URL
});
pool.on('connect', function () {// console.log('connected to the Database');
});
var _default = {
  query: function query(text, params) {
    return new Promise(function (resolve, reject) {
      pool.query(text, params).then(function (res) {
        resolve(res);
      })["catch"](function (e) {
        reject(e);
      });
    });
  }
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map
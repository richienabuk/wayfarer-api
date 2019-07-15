"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

_dotenv["default"].config();

var app = (0, _express["default"])();
(0, _routes["default"])(app); // eslint-disable-next-line no-console

app.listen(process.env.PORT, function () {
  return console.log("Server is running on port ".concat(process.env.PORT, "!"));
});
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
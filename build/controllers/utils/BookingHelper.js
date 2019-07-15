"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable no-restricted-syntax */

/* eslint-disable no-param-reassign */
var Seat = {
  getAvailableSeat: function getAvailableSeat(taken, capacity) {
    var tempCapacity = [];

    for (var i = 1; i <= capacity; i += 1) {
      tempCapacity.push(i);
    }

    capacity = tempCapacity;
    var availableSeat = []; // eslint-disable-next-line no-param-reassign

    taken = taken.toString().split(',').map(Number); // eslint-disable-next-line no-param-reassign

    capacity = capacity.toString().split(',').map(Number);

    for (var _i in capacity) {
      if (!taken.includes(capacity[_i])) availableSeat.push(capacity[_i]);
    }

    return availableSeat;
  },
  generateSeatNumber: function generateSeatNumber(available) {
    if (available.length > 0) {
      var item = available[Math.floor(Math.random() * available.length)];
      return item;
    }

    return 'no seats available';
  }
};
var _default = Seat;
exports["default"] = _default;
//# sourceMappingURL=BookingHelper.js.map
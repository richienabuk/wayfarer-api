/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const Seat = {
  getAvailableSeat(taken, capacity) {
    const tempCapacity = [];
    for (let i = 1; i <= capacity; i += 1) {
      tempCapacity.push(i);
    }
    capacity = tempCapacity;
    const availableSeat = [];

    // eslint-disable-next-line no-param-reassign
    taken = taken.toString().split(',').map(Number);
    // eslint-disable-next-line no-param-reassign
    capacity = capacity.toString().split(',').map(Number);

    for (let i in capacity) {
      if (!taken.includes(capacity[i])) availableSeat.push(capacity[i]);
    }

    return availableSeat;
  },

  generateSeatNumber(available) {
    if (available.length > 0) {
      const item = available[Math.floor(Math.random() * available.length)];
      return item;
    }
    return 'no seats available';
  },
};

export default Seat;

import pg from 'pg';
import config from '../config';

const pool = new pg.Pool(config);

pool.on('connect', () => {
  // console.log('connected to the Database');
});

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};

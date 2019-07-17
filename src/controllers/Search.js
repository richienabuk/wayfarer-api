import db from '../database';

const Search = {
  async trips(req, res) {
    if (!req.body.origin && !req.body.destination) {
      return res.status(400).send({
        status: 'error',
        error: 'Enter at least one search parameter',
      });
    }
    const getSearchQuery = 'select * from trips where origin Ilike $1 AND status=$2 OR destination ILIKE $3 AND status =$2';
    const search = [
      `%${req.body.origin}%`,
      'active',
      `%${req.body.destination}%`,
    ];
    try {
      const { rows, rowCount } = await db.query(getSearchQuery, search);
      const data = rows;
      // data.trip_id = rows.id;
      // data.capacity = rows.capacity;
      return res.status(200).send({
        status: 'success',
        data,
        // rows,
        rowCount,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },
};

export default Search;

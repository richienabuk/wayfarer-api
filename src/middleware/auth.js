import jwt from 'jsonwebtoken';
import db from '../database';

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  /**
   * Check if token available
   * Returns 401
   */
  const token = req.header('x-access-token');
  if (!token) return res.status(401).send({ status: 'error', error: 'Access denied. No token provided.' });

  /**
   * Verify header token by comparing with JWT_SECRET
   * Return user decoded details if true || 401
   */
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const text = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(text, [decoded.userId]);
    if (!rows[0]) {
      return res.status(400).send({ status: 'error', error: 'The token you provided is invalid' });
    }
    req.user = {
      id: decoded.userId,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
      isAdmin: decoded.isAdmin,
    };
    // req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send({ status: 'error', error: e });
  }
};

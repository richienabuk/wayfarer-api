// eslint-disable-next-line consistent-return
export default (req, res, next) => {
  /**
   * Check if logged in user is admin
   */
  if (!req.user.isAdmin) return res.status(403).send({ status: 'error', error: 'Access denied' });
  next();
};

const { fail } = require('../utils/response');

const notFoundHandler = (req, res) => {
  fail(res, `Route ${req.method} ${req.path} not found`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);
  if (err.type === 'entity.parse.failed') {
    return fail(res, 'Invalid JSON body', 400);
  }
  fail(res, err.message || 'Internal server error', err.status || 500);
};

module.exports = { notFoundHandler, errorHandler };

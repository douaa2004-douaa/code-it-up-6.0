const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

const created = (res, data) => ok(res, data, 201);

const fail = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

const notFound = (res, message = 'Not found') => fail(res, message, 404);

const unauthorized = (res, message = 'Unauthorized') => fail(res, message, 401);

const forbidden = (res, message = 'Forbidden') => fail(res, message, 403);

const serverError = (res, err) => {
  console.error(err);
  return fail(res, 'Internal server error', 500);
};

module.exports = { ok, created, fail, notFound, unauthorized, forbidden, serverError };

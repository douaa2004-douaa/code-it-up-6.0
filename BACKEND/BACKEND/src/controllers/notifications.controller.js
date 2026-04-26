const svc = require('../services/notifications.service');
const { ok, fail, serverError } = require('../utils/response');

const handle = (fn) => async (req, res) => {
  try { return await fn(req, res); }
  catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); }
};

const list       = handle(async (req, res) => ok(res, await svc.list(req.user.id, req.query)));
const markRead   = handle(async (req, res) => ok(res, await svc.markRead(req.params.id, req.user.id)));
const markAllRead = handle(async (req, res) => { await svc.markAllRead(req.user.id); ok(res, { updated: true }); });
const remove     = handle(async (req, res) => { await svc.remove(req.params.id, req.user.id); ok(res, { deleted: true }); });

module.exports = { list, markRead, markAllRead, remove };

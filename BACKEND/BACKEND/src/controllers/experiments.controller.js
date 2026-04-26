const svc = require('../services/experiments.service');
const { ok, created, fail, serverError } = require('../utils/response');

const handle = (fn) => async (req, res) => {
  try { return await fn(req, res); }
  catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); }
};

const list         = handle(async (req, res) => ok(res, await svc.list(req.user.id, req.query)));
const getOne       = handle(async (req, res) => ok(res, await svc.getOne(req.params.id, req.user.id)));
const create       = handle(async (req, res) => created(res, await svc.create(req.user.id, req.body)));
const updateStatus = handle(async (req, res) => ok(res, await svc.updateStatus(req.params.id, req.user.id, req.body)));
const remove       = handle(async (req, res) => { await svc.remove(req.params.id, req.user.id); ok(res, { deleted: true }); });

module.exports = { list, getOne, create, updateStatus, remove };

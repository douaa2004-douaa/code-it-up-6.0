const svc = require('../services/agent.service');
const { ok, created, fail, serverError } = require('../utils/response');

const handle = (fn) => async (req, res) => {
  try { return await fn(req, res); }
  catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); }
};

const run    = handle(async (req, res) => created(res, await svc.create(req.user.id, req.body)));
const list   = handle(async (req, res) => ok(res, await svc.list(req.user.id, req.query)));
const getOne = handle(async (req, res) => ok(res, await svc.getOne(req.params.id, req.user.id)));

module.exports = { run, list, getOne };

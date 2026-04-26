const svc = require('../services/ai.service');
const { ok, fail, serverError } = require('../utils/response');

const handle = (fn) => async (req, res) => {
  try { return await fn(req, res); }
  catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); }
};

const research     = handle(async (req, res) => ok(res, await svc.research(req.user.id, req.body.project_id, req.body)));
const analyze      = handle(async (req, res) => ok(res, await svc.analyze(req.user.id, req.body.project_id, req.body)));
const generateTask = handle(async (req, res) => ok(res, await svc.generateTask(req.user.id, req.body.project_id, req.body)));
const logs         = handle(async (req, res) => ok(res, await svc.getLogs(req.user.id, req.query)));

module.exports = { research, analyze, generateTask, logs };

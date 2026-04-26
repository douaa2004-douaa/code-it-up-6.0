const svc = require('../services/projects.service');
const { ok, created, fail, serverError } = require('../utils/response');

const list    = async (req, res) => { try { return ok(res, await svc.list(req.user.id, req.query)); } catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); } };
const getOne  = async (req, res) => { try { return ok(res, await svc.getOne(req.params.id, req.user.id)); } catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); } };
const create  = async (req, res) => { try { return created(res, await svc.create(req.user.id, req.body)); } catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); } };
const update  = async (req, res) => { try { return ok(res, await svc.update(req.params.id, req.user.id, req.body)); } catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); } };
const remove  = async (req, res) => { try { await svc.remove(req.params.id, req.user.id); return ok(res, { deleted: true }); } catch (e) { e.status ? fail(res, e.message, e.status) : serverError(res, e); } };

module.exports = { list, getOne, create, update, remove };

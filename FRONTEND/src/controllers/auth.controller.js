const authService = require('../services/auth.service');
const { ok, created, fail, serverError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return created(res, result);
  } catch (err) {
    if (err.status) return fail(res, err.message, err.status);
    return serverError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return ok(res, result);
  } catch (err) {
    if (err.status) return fail(res, err.message, err.status);
    return serverError(res, err);
  }
};

const refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return ok(res, result);
  } catch (err) {
    if (err.status) return fail(res, err.message, err.status);
    return serverError(res, err);
  }
};

const profile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);
    return ok(res, result);
  } catch (err) {
    if (err.status) return fail(res, err.message, err.status);
    return serverError(res, err);
  }
};

module.exports = { register, login, refresh, profile };

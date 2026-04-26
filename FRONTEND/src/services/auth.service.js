const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

const register = async ({ email, password, full_name }) => {
  const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rows.length) throw { status: 409, message: 'Email already registered' };

  const password_hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3) RETURNING id, email, full_name, role, created_at`,
    [email, password_hash, full_name]
  );
  const user = rows[0];

  await query('INSERT INTO user_settings (user_id) VALUES ($1)', [user.id]);

  const accessToken = signAccess({ id: user.id, role: user.role });
  const refreshToken = signRefresh({ id: user.id });
  return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const { rows } = await query(
    'SELECT id, email, full_name, role, password_hash FROM users WHERE email = $1',
    [email]
  );
  const user = rows[0];
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  delete user.password_hash;
  const accessToken = signAccess({ id: user.id, role: user.role });
  const refreshToken = signRefresh({ id: user.id });
  return { user, accessToken, refreshToken };
};

const refresh = async (token) => {
  let payload;
  try {
    payload = verifyRefresh(token);
  } catch {
    throw { status: 401, message: 'Invalid refresh token' };
  }
  const { rows } = await query(
    'SELECT id, role FROM users WHERE id = $1',
    [payload.id]
  );
  if (!rows.length) throw { status: 401, message: 'User not found' };
  const user = rows[0];
  const accessToken = signAccess({ id: user.id, role: user.role });
  return { accessToken };
};

const getProfile = async (userId) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.created_at, s.theme, s.language, s.notifications_enabled
     FROM users u
     LEFT JOIN user_settings s ON s.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  if (!rows.length) throw { status: 404, message: 'User not found' };
  return rows[0];
};

module.exports = { register, login, refresh, getProfile };

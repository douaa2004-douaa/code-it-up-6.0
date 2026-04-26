const OpenAI = require('openai');
const crypto = require('crypto');
const { query } = require('../db/pool');
const redis = require('../config/redis');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL  = process.env.OPENAI_MODEL || 'gpt-4o';

const cacheKey = (type, prompt) =>
  crypto.createHash('sha256').update(`${type}:${prompt}`).digest('hex');

const getCache = async (key) => {
  try {
    const cached = await redis.get(`ai:${key}`);
    if (cached) {
      await query('UPDATE research_cache SET hit_count = hit_count + 1 WHERE cache_key = $1', [key]);
      return JSON.parse(cached);
    }
  } catch {}
  return null;
};

const setCache = async (key, data, ttlSeconds = 3600) => {
  try {
    await redis.set(`ai:${key}`, JSON.stringify(data), 'EX', ttlSeconds);
    await query(
      `INSERT INTO research_cache (cache_key, response, model, expires_at)
       VALUES ($1,$2,$3, NOW() + INTERVAL '${ttlSeconds} seconds')
       ON CONFLICT (cache_key) DO UPDATE SET hit_count = research_cache.hit_count + 1`,
      [key, JSON.stringify(data), MODEL]
    );
  } catch {}
};

const logAction = async ({ userId, projectId, actionType, prompt, response, tokensUsed, latencyMs }) => {
  await query(
    `INSERT INTO ai_actions_log (user_id, project_id, action_type, prompt, response, model, tokens_used, latency_ms)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [userId, projectId, actionType, prompt, response, MODEL, tokensUsed, latencyMs]
  ).catch(() => {});
};

const call = async ({ userId, projectId, actionType, systemPrompt, userPrompt, useCache = true }) => {
  const key = cacheKey(actionType, userPrompt);

  if (useCache) {
    const cached = await getCache(key);
    if (cached) return { ...cached, cached: true };
  }

  const start = Date.now();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt || 'You are a helpful lab research assistant.' },
      { role: 'user',   content: userPrompt },
    ],
  });

  const latency  = Date.now() - start;
  const response = completion.choices[0].message.content;
  const tokens   = completion.usage?.total_tokens;

  await logAction({ userId, projectId, actionType, prompt: userPrompt, response, tokensUsed: tokens, latencyMs: latency });
  if (useCache) await setCache(key, { response, tokens });

  return { response, tokens, latency_ms: latency, cached: false };
};

const research = (userId, projectId, { query: q }) =>
  call({
    userId, projectId, actionType: 'research',
    systemPrompt: 'You are a scientific research assistant. Provide clear, evidence-based responses.',
    userPrompt: q,
    useCache: true,
  });

const analyze = (userId, projectId, { data, question }) =>
  call({
    userId, projectId, actionType: 'analyze',
    systemPrompt: 'You are a data analysis expert for lab experiments.',
    userPrompt: `Data:\n${JSON.stringify(data)}\n\nQuestion: ${question}`,
    useCache: false,
  });

const generateTask = (userId, projectId, { context }) =>
  call({
    userId, projectId, actionType: 'generate-task',
    systemPrompt: 'Generate structured lab tasks based on context. Return as JSON.',
    userPrompt: context,
    useCache: false,
  });

const getLogs = async (userId, { page = 1, limit = 20, action_type }) => {
  const offset = (page - 1) * limit;
  const params = [userId];
  let where = 'WHERE user_id = $1';
  if (action_type) { params.push(action_type); where += ` AND action_type = $${params.length}`; }
  const { rows } = await query(
    `SELECT * FROM ai_actions_log ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

module.exports = { research, analyze, generateTask, getLogs };

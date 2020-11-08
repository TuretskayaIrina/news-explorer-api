const rateLimit = require('express-rate-limit');

// ограничиваем число запросов с одного IP до 100 запросов за 15 минут
module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

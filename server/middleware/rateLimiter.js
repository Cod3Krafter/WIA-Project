import rateLimit from 'express-rate-limit'

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 3, // limit each IP requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 seconds'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
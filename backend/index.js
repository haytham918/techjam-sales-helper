import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import moment from "moment";

import { chat } from './chat.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use(
  session({
    secret: crypto.randomBytes(20).toString('hex'),
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

/**
 * Custom rate limit exceeded response
 * @param {Request} _req
 * @param {Response} res
 */
const rateLimitExceededResponse = (_req, res) => {
  const response = {
    sender: "system",
    timestamp: moment().format("YYYY-MM-DD HH:mm"),
    text: "You have exceeded the 50 requests per day limit!",
    products: null,
  };
  res.status(429).json(response);
};

const chatRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 50, // Limit each user to 50 requests per day
  headers: true,
  handler: rateLimitExceededResponse,
});

app.post("/api/chat", chatRateLimiter, chat);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

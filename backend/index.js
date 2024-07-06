import express from 'express';
import session from 'express-session';
import { chat } from './chat.js';
import crypto from 'crypto';

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

app.post("/api/chat", chat);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

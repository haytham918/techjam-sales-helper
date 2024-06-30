import express from 'express';
import session from 'express-session';
import { chat } from './chat.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(
  session({
    secret: "djiawdommijaodmwaid",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.post("/api/chat", chat);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

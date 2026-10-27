// src/main.ts
import express, { type Express, type Request, type Response } from 'express';
import path from 'path';
import { usersRouter } from './routers/users.ts';   // ← on importe le router
import { loginRouter } from './routers/login.ts';   // ← on importe le router
import {rateLimit} from 'express-rate-limit';

const app: Express = express();

//Middleware
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, 'public')));

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

//Toutes les routes users vivent maintenant dans routers/users.ts
app.use(usersRouter);
app.use(loginRouter);

app.listen(3000);
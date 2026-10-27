// src/main.ts
import express, { type Express, type Request, type Response } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { usersRouter } from './routers/users.ts';   // ← on importe le router
import { loginRouter } from './routers/login.ts';   // ← on importe le router

const app: Express = express();

//Middleware
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, 'public')));

//Toutes les routes users vivent maintenant dans routers/users.ts
app.use(usersRouter);
app.use(loginRouter);

app.listen(3000);
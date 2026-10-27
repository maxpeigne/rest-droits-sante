import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'node:fs/promises';
import Joi from 'joi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Le "router" = mini-app qui regroupe les routes
export const loginRouter = Router();

//Login → génère le JWT
loginRouter.post('/login', async (req: Request, res: Response) => {
  const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().alphanum().min(1).max(30).required()
  });

  const { error, value } = schema.validate({
    name: req.body.name,
    password: req.body.password,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { username, password } = req.body;

  //Creation du chemin du du fichier users.json
  const PathUsersFile = path.join(__dirname, '../data/users.json');

  //Lecture du fichier users.json
  const usersFile = JSON.parse(await readFile(PathUsersFile, 'utf-8'));

  //Recherche du user
  const user = usersFile.find(((u: { username: any; password: any; }) => u.username == username && u.password == password));
  console.log("user =", JSON.stringify(user, null, 2)); 

  if (!user) {
    return res.status(401).send({ error: 'Identifiants invalides' });
  }

  res.json({ token: jwt.sign({ name: user.name, role: user.role }, 'secret-jwt', { expiresIn: '2m' }) });
});
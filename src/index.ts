import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Database } from './database';
import { AppBuilder } from './appBuilder';
// import { AuthController } from './controller/Auth.controller';
import { UsersController } from './controller/User.controller';
import { errorMiddleware } from './middleware/error.middleware';
import { AuthController } from './controller/Auth.controller';

import * as jwt from 'jsonwebtoken';
app.get('/', (req, res) => {
  const { id } = jwt.decode(
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1NDZiMGMwLTVkNTEtNDRjMS05YWVhLWMwZTEzOTNjZWJkYSIsImVtYWlsIjoic29maWFuMTFpMUB5YWhvby5jb20iLCJpYXQiOjE2MTE1MDY5MzEsImV4cCI6MTYxMTUwNzgzMSwic3ViIjoiZjU0NmIwYzAtNWQ1MS00NGMxLTlhZWEtYzBlMTM5M2NlYmRhIiwianRpIjoiMjM1ZjFjMjItM2UzOS00Y2EzLWE5ZTUtMDY2YWEyN2I1YmRmIn0.Z2NlhwmIg_WGKW6Ta_hMrQPlWHIc6spa8nHdtVeLbB0`
  );
  res.json(id);
});

const app = express();
const appBuilder = new AppBuilder(app);
const PORT: number = Number(process.env.PORT) || 5000;
Database.initialize();

appBuilder
  .addMiddleware(express.json())
  .addController(new UsersController())
  .addController(new AuthController())
  .addMiddleware(errorMiddleware)
  .build(PORT, () => console.log(`listening on port: ${PORT}`));
